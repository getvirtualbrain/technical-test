import { Pokemon, PokemonType } from '@shared/types';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from '../../atoms/Header';
import { useTheme } from '../../atoms/ThemeContext';
import PokemonList from './PokemonList';
import PokemonSearchBar from './PokemonSearchBar';
import PokemonTypes from './PokemonTypes';

const API_URL = 'http://localhost:3001'

const PokemonApp: React.FC = () => {
  const [fetched, setFetched] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<PokemonType[]>([]);
  const [search, setSearch] = useState("");
  const { theme } = useTheme();
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);

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
      <PokemonSearchBar onChange={setSearch} />
      <PokemonTypes types={types} onTypeClick={handleTypeClick} selectedTypes={selectedTypes} />
      <PokemonList pokemons={pokemonList} />
    </div>
  );
};

export default PokemonApp;
