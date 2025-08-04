import { Pokemon, PokemonType } from '@shared/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../api/constants';
import Header from '../../atoms/Header';
import { useTheme } from '../../atoms/ThemeContext';
import PokemonBattleSelection from './PokemonBattleSelection';
import PokemonList from './PokemonList';
import PokemonSearchBar from './PokemonSearchBar';
import PokemonTypes from './PokemonTypes';

const PokemonApp: React.FC = () => {
  const [fetched, setFetched] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [search, setSearch] = useState("");
  const { theme } = useTheme();
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const [selectedPokemons, setSelectedPokemons] = useState<Pokemon[]>([]);
  const [battleResult, setBattleResult] = useState<string | null>(null);
  const [isFighting, setIsFighting] = useState<boolean>(false);

  useEffect(() => {
    const getTypes = async () => {
      const response = await axios.get(`${API_URL}/pokemons/types`);
      setTypes(response.data.types);
    }
    getTypes();
  }, []);

  useEffect(() => {
    const getPokemon = async () => {
      let data: Pokemon[] = [];

      try {
        if (search || selectedTypes.length > 0) {
          const response = await axios.get(`${API_URL}/pokemons?name=${search}&types=${selectedTypes.map(type => type.name).join(',')}`);
          data = response.data.pokemons
        } else {
          const response = await axios.get(`${API_URL}/pokemons/limit/40`);
          data = response.data.pokemons
        };
        setPokemonList(data);
        setFetched(true);
      } catch {
        setPokemonList([]);
      }
    }
    getPokemon();
  }, [search, selectedTypes]);

  const handleTypeClick = (type: PokemonType) => {
    setSelectedTypes((prevTypes) => {
      const isAlreadySelected = prevTypes.some((t) => t.name === type.name);
      if (isAlreadySelected) {
        return prevTypes.filter((t) => t.name !== type.name);
      }
      return [...prevTypes, type];
    });
  };

  const handlePokemonClick = (selectedPokemon: Pokemon) => {
    if (selectedPokemons.length === 0) {
      setSelectedPokemons([selectedPokemon]);
    } else if (selectedPokemons.length === 1 && selectedPokemons[0].id !== selectedPokemon.id) {
      setSelectedPokemons([selectedPokemons[0], selectedPokemon]);
    }
  }

  const handleSelectedPokemonClick = (selectedPokemon: Pokemon) => {
    setBattleResult(null);
    setSelectedPokemons(selectedPokemons.filter(pokemon => { return pokemon.id !== selectedPokemon.id }))
  }

  const handleFightClick = async () => {
    if (selectedPokemons.length !== 2 || isFighting) return;

    setIsFighting(true);
    setBattleResult("Starting battle between " + selectedPokemons[0].name + " and " + selectedPokemons[1].name + "...\n");
    const url = `${API_URL}/pokemons/battle/${selectedPokemons[0].id}/${selectedPokemons[1].id}`;

    const response = await fetch(url);

    if (!response.body) {
      console.error("No stream received.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
      setBattleResult(result);
    }

    setIsFighting(false);
  };



  if (!fetched) {
    return (
      <div className="flex items-center h-screen">
        <div className="text-lg text-center w-full">Loading Pokemons...</div>
      </div>
    );
  }

  return (
    <div className={`${theme === "light" ? "bg-amber-50" : "bg-slate-800"} flex flex-col items-center`}>
      <Header />

      {/* Battle selection and result */}
      {selectedPokemons.length === 0 && <h1 className={`py-8 text-2xl ${theme === 'light' ? 'text-black' : 'text-white'}`}>Select 2 pokemons for battle</h1>}
      <PokemonBattleSelection isFighting={isFighting} selectedPokemons={selectedPokemons} onPokemonClick={handleSelectedPokemonClick} onFightClick={handleFightClick} />
      {battleResult && <div className={`p-12 whitespace-pre-wrap text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}>{battleResult}</div>}
      {selectedPokemons.length === 2 && !isFighting && (
        <button onClick={handleFightClick} className={`bg-red-500 text-white px-8 py-4 rounded-md text-white`}>Fight!</button>
      )}

      {/* Search and filter */}
      <PokemonSearchBar onChange={setSearch} />
      <PokemonTypes types={types} onTypeClick={handleTypeClick} selectedTypes={selectedTypes} />
      <PokemonList selectable={selectedPokemons.length < 2} pokemons={pokemonList} onPokemonClick={handlePokemonClick} />
    </div>
  );
};

export default PokemonApp;
