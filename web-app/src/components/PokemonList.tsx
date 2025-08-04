import React from "react";
import { Pokemon } from "../types/pokemon";
import Card from "./Card";
import { useTheme } from "./ThemeContext";

interface PokemonListProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  setSelectedPokemon?: React.Dispatch<React.SetStateAction<Pokemon[] | null>>;
}

const PokemonList: React.FC<PokemonListProps> = ({
  pokemons,
  isLoading,
  setSelectedPokemon,
}) => {
  const { theme } = useTheme();

  if (isLoading) {
    return (
      <div className="flex items-center h-screen">
        <div className="text-lg text-center w-full">Loading Pokemons...</div>
      </div>
    );
  }

  if (!pokemons || pokemons.length === 0) {
    return (
      <div className="flex items-center">
        <div className="text-lg text-center w-full">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 place-items-center ${
        theme === "light" ? "" : "bg-slate-800"
      }`}
    >
      {pokemons.map((p) => (
        <Card key={p.id} pokemon={p} setSelectedPokemon={setSelectedPokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
