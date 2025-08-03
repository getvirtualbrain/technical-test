import { Pokemon } from '@shared/types';
import React from 'react';
import { useTheme } from "../../atoms/ThemeContext";
import PokemonCard from './PokemonCard';


interface PokemonListProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  selectable?: boolean;
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons, onPokemonClick, selectable = false }) => {
  const { theme } = useTheme();

  if (pokemons.length === 0) {
    return (
      <div className="flex items-center">
        <div className="text-lg text-center w-full">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div className={`p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 place-items-center ${theme === 'light' ? '' : 'bg-slate-800'}`}>
      {pokemons.map((p) => (
        <PokemonCard pokemon={p} key={p.id} onClick={() => onPokemonClick(p)} selectable={selectable} />
      ))}
    </div>
  );
};

export default PokemonList;
