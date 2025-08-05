import React from 'react';
import { useTheme } from "./ThemeContext";
import Card from './Card';

interface PokemonListProps {
  pokemons: any[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const { theme } = useTheme();

  if (pokemons.length === 0) {
    return (
      <div className="flex items-center">
        <div className="text-lg text-center w-full">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div className={`p-4 grid grid-cols-4 gap-10 place-items-center ${theme === 'light' ? '' : 'bg-slate-800'}`}>
        {pokemons.map((p) => (
              <Card pokemon={p} />
        ))}
    </div>
  );
};

export default PokemonList;
