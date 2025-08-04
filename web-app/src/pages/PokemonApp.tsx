import React, { useState } from "react";
import ChoosedPokemons from "../components/ChoosedPokemons";
import { Header } from "../components/Header";
import PokemonList from "../components/PokemonList";
import { useTheme } from "../components/ThemeContext";
import { useGetPokemonsByFilters } from "../hooks/useGetPokemonsByFilters";
import { Pokemon } from "../types/pokemon";

const PokemonApp: React.FC = () => {
  const [name, setName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon[] | null>(
    null
  );

  const {
    data: pokemons,
    isLoading,
    isError,
    refetch,
  } = useGetPokemonsByFilters({ name, type: selectedTypes.join(",") });
  const { theme } = useTheme();

  if (isError) {
    return (
      <div className="flex items-center h-screen">
        <div className="text-lg text-center w-full">Error loading Pokemons</div>
      </div>
    );
  }

  return (
    <div
      className={`${
        theme === "light" ? "bg-amber-50" : "bg-slate-800"
      } flex flex-col items-center`}
    >
      <Header
        name={name}
        setName={setName}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        refetch={refetch}
      />
      <ChoosedPokemons
        selectedPokemon={selectedPokemon}
        setSelectedPokemon={setSelectedPokemon}
      />

      <PokemonList
        pokemons={pokemons || []}
        isLoading={isLoading}
        setSelectedPokemon={setSelectedPokemon}
      />
    </div>
  );
};

export default PokemonApp;
