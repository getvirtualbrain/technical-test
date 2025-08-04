import { useQuery } from "@tanstack/react-query";

type PokemonType = {
  name: string;
  image: string;
};

export const useGetTypes = () => {
  return useQuery<PokemonType[]>({
    queryKey: ["types"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/pokemons/types");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.types;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
