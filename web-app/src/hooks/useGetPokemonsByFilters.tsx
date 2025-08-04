// src/hooks/useGetPokemonsByFilters.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type PokemonFilters = {
  name?: string;
  type?: string;
};

async function fetchPokemons(filters: PokemonFilters, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.name) params.append("name", filters.name);
  if (filters.type) params.append("types", filters.type);

  const url = `http://localhost:3001/pokemons?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(
      `Erreur lors de la récupération des pokémons (${res.status})`
    );
  }
  const data = await res.json();
  return data.pokemons;
}

export function useGetPokemonsByFilters(filters: PokemonFilters) {
  const [debouncedFilters, setDebouncedFilters] =
    useState<PokemonFilters>(filters);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => {
      clearTimeout(handle);
    };
  }, [filters]);

  return useQuery({
    queryKey: ["pokemons", debouncedFilters],
    queryFn: ({ signal }) => fetchPokemons(debouncedFilters, signal),
    staleTime: 1000 * 30,
    retry: 1,
  });
}
