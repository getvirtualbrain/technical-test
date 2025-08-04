import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LifeBar from "../components/LifeBar";
import { useTheme } from "../components/ThemeContext";
import { useGetPokemonFight } from "../hooks/useGetPokemonFight";
import { queryClient } from "../queryClients";
import { Pokemon } from "../types/pokemon";

const damageRegex = /^-(\w+):(\d+)$/;

const Fight: React.FC = () => {
  const { theme } = useTheme();
  const routeStates = useLocation().state;
  const navigate = useNavigate();

  const [pokemons, setPokemons] = React.useState<{ [key: number]: number }>({});
  const [winnerAndLoser, setWinnerAndLoser] = React.useState<{
    winner: number;
    loser: number;
  } | null>(null);

  useEffect(() => {
    if (!routeStates || !Array.isArray(routeStates.selectedPokemon)) return;

    setPokemons(
      routeStates.selectedPokemon.reduce(
        (acc: { [key: number]: number }, pokemon: Pokemon) => {
          acc[pokemon.id] = pokemon.stats.HP;
          return acc;
        },
        {}
      )
    );
  }, [routeStates]);

  const { data, isLoading, error } = useGetPokemonFight(
    routeStates?.selectedPokemon
  );
  const fightResult = Array.isArray(data) ? data : ([] as string[]);

  useEffect(() => {
    if (
      !fightResult ||
      !Array.isArray(fightResult) ||
      fightResult.length === 0
    ) {
      return;
    }

    if (fightResult[fightResult.length - 1].startsWith("---END---")) {
      const [winnerId, loserId] = fightResult[fightResult.length - 1]
        .split("---END---")[1]
        .split(":");
      setWinnerAndLoser({ winner: Number(winnerId), loser: Number(loserId) });
      return;
    }

    const HPUpdates: Record<number, number> = {};
    for (let i = fightResult.length - 1; i >= 0; i--) {
      const line = fightResult[i];
      const match = line.match(damageRegex);
      if (match) {
        const [, idStr, hpStr] = match;
        const id = Number(idStr);
        if (!(id in HPUpdates)) {
          HPUpdates[id] = Number(hpStr);
        }
      }
    }

    if (Object.keys(HPUpdates).length) {
      setPokemons((prev) => ({ ...prev, ...HPUpdates }));
    }
  }, [fightResult]);

  return (
    <div
      className={`${
        theme === "light" ? "bg-amber-50" : "bg-slate-800"
      } flex flex-col items-center pt-8 min-h-screen bg-[url('https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/virtual-backgrounds/sword-shield/pokemon-gym.png')] bg-cover bg-center no-repeat bg-fixed`}
    >
      <div className="flex flex-wrap gap-6 mb-6">
        {routeStates?.selectedPokemon?.map((pokemon: Pokemon) => (
          <div key={pokemon.id} className="flex flex-col items-center">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className={`${
                winnerAndLoser?.winner === pokemon.id
                  ? "ring-4 ring-yellow-500"
                  : ""
              } w-32 h-32 rounded-full mb-2`}
            />
            <LifeBar
              current={pokemons[pokemon.id] ?? pokemon.stats.HP}
              max={pokemon.stats.HP}
            />
            <h2
              className={`${
                winnerAndLoser?.loser === pokemon.id ? "line-through" : ""
              } text-xl font-bold`}
            >
              {pokemon.name}
            </h2>
            {winnerAndLoser?.winner === pokemon.id && (
              <h3 className="text-green-500">Vainceur</h3>
            )}{" "}
            {winnerAndLoser?.loser === pokemon.id && (
              <h3 className="text-red-500">Perdant</h3>
            )}
          </div>
        ))}
      </div>
      {winnerAndLoser?.winner && (
        <button
          onClick={() => {
            queryClient.setQueryData(["pokemons", "fight"], []);
            navigate("/");
          }}
          className={`mt-4 px-4 py-2 rounded-md text-white ${
            theme === "light" ? "bg-blue-500" : "bg-blue-700"
          } mb-4`}
        >
          Fin du combat, relancer un combat
        </button>
      )}
      {isLoading || error ? (
        <p>Création de votre combat...</p>
      ) : (
        <ul className="w-full max-w-xl flex-1 overflow-auto px-4 mb-4 bg-white/80 rounded-lg shadow-lg">
          {fightResult.map((fightLine, index) => {
            if (fightLine.startsWith("---END---")) return;
            if (fightLine.startsWith("Tour ")) {
              return (
                <li key={index} className="font-bold font-mono text-lg">
                  {fightLine}
                </li>
              );
            }
            if (fightLine.startsWith("**")) {
              return (
                <li key={index} className="font-bold font-mono">
                  {fightLine.replace(/\*\*/g, "")}
                </li>
              );
            }
            if (damageRegex.test(fightLine)) {
              return null;
            }
            return (
              <li key={index} className="text-justify font-mono">
                {fightLine}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Fight;
