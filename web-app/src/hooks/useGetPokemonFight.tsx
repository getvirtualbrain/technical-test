import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pokemon } from "../types/pokemon";

const token = import.meta.env.VITE_TOKEN;

async function fetchStreamedItems(
  url: string,
  signal: AbortSignal,
  onPartial: (items: string[]) => void
): Promise<string[]> {
  const resp = await fetch(url, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!resp.body) throw new Error("Streaming not supported");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const accumulated: string[] = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    const newstrings: string[] = [];
    for (const line of lines) {
      if (line.trim() === "") continue;
      try {
        newstrings.push(line);
        accumulated.push(line);
      } catch (e) {
        console.error("Failed to parse line:", line, e);
      }
    }

    if (newstrings.length) {
      onPartial(newstrings);
    }
  }

  if (buffer.trim()) {
    try {
      accumulated.push(buffer);
      onPartial([buffer]);
    } catch {
      console.error("Failed to parse last buffer:", buffer);
    }
  }

  return accumulated;
}

export const useGetPokemonFight = (pokemons: Pokemon[]) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["pokemons", "fight"],
    queryFn: async ({ signal }) => {
      const pokemonsName = pokemons.map((pokemon) => pokemon.name).join(",");
      const query = `Génère moi un combat Pokémon entre les Pokémons suivants : ${pokemonsName}.
      Tu dois me donner les attaques de chaque Pokémon, les dégâts infligés, et le résultat du combat.
      Tu dois me donner le combat sous forme de stream avec les étapes du combat, les attaques, les dégâts, et le résultat final.
      Le combat doit être détaillé, avec toutes les informations nécessaires pour comprendre le déroulement du combat.
      Quand le combat sera fini, envoie moi une ligne ---END---winnerId:loserId pour que je puisse comprendre que le combat sera fini et j'agirais en conséquences. Il me faut absolument la dernière ligne ---END---winnerId:loserId.
      Tu vas commencer par me donner le premier tour du combat, et ensuite tu vas me donner les tours suivants un par un. Sans que j'ai à te demander de continuer.
      Pour les lignes indicants les HP actuels des pokemons, j'attends ce format : "-id:HPActuels" (sans espaces), et je veux aussi avoir ces informations à la fin du dernier tour
      La première ligne doit être Tour 1, pas une phrase d'introduction.`;

      fetchStreamedItems(
        `https://chatbot-api.getvirtualbrain.com/open-completion/${
          import.meta.env.VITE_CHATBOT_ID
        }/query?query=${query}`,
        signal,
        (partial) => {
          queryClient.setQueryData<string[]>(
            ["pokemons", "fight"],
            (old = []) => [...old, ...partial]
          );
        }
      );
    },
    enabled: !!pokemons.length,
    refetchOnMount: "always",
  });
};
