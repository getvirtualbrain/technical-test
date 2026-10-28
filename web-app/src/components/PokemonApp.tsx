import React, { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import { Header } from './Header';
import { useTheme } from './ThemeContext';
import axios from 'axios';

const API_URL = 'http://localhost:3001'

const PokemonApp: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const getPokemon = async () => {
            const response = await axios.get(`${API_URL}/pokemons/1`);
			const pokemon = response.data.pokemon
            setPokemonList([pokemon]);
    };

    getPokemon();
  }, []);

  if (!pokemonList.length) {
    return (
      <div className="flex items-center h-screen">
        <div className="text-lg text-center w-full">Loading Pokemons...</div>
      </div>
    );
  }

  return (
    <div className={`${theme === "light" ? "bg-amber-50" : "bg-slate-800"} flex flex-col items-center`}>
      <Header/>
      <PokemonList pokemons={pokemonList}/>
    </div>
  );
};

export default PokemonApp;
