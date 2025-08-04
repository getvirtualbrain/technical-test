import React from "react";
import { useNavigate } from "react-router-dom";
import { Pokemon } from "../types/pokemon";
import Card from "./Card";
import { useTheme } from "./ThemeContext";

type ChoosedPokemonsProps = {
  selectedPokemon: Pokemon[] | null;
  setSelectedPokemon?: React.Dispatch<React.SetStateAction<Pokemon[] | null>>;
};

const ChoosedPokemons: React.FC<ChoosedPokemonsProps> = ({
  selectedPokemon,
  setSelectedPokemon,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div
      className={`p-4 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-10 place-items-center ${
        theme === "light" ? "" : "bg-slate-800"
      }`}
    >
      {(!selectedPokemon || selectedPokemon.length === 0) && (
        <h2 className="text-2xl font-thin mb-4">
          Choisissez au moins deux Pokémons pour démarrer le combat
        </h2>
      )}
      {selectedPokemon?.length === 1 && (
        <h2 className="text-2xl font-thin mb-4">
          Choisissez encore un autre pokemon au moins pour démarer le combat :
        </h2>
      )}
      {selectedPokemon && selectedPokemon.length > 1 && (
        <div>
          <h2 className="text-2xl font-thin mb-4">
            {selectedPokemon.length} Pokémons prêts pour le combat
          </h2>
          <button
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              theme === "light" ? "bg-blue-500" : "bg-blue-700"
            }`}
            onClick={() => {
              navigate("/fight", {
                state: { selectedPokemon, key: Date.now() },
              });
            }}
          >
            Lancer le combat
          </button>
        </div>
      )}

      {selectedPokemon?.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          setSelectedPokemon={setSelectedPokemon}
        />
      ))}
    </div>
  );
};

export default ChoosedPokemons;
