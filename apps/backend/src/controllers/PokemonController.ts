import { PokemonType } from "@getvirtualbrain-technical-test/shared-types";
import axios from "axios";
import { type Request, type Response, Router } from "express";

import { fetchAllPokemons, fetchPokemonById } from "@/services/PokemonService";

const PokemonController: Router = Router();
const POKEMON_API_URL = "https://pokebuildapi.fr/api/v1";

PokemonController.get("", async (req: Request, res: Response) => {
  try {
    const {
      search = "",
      types,
      names,
    } = req.query as { search?: string; types?: string; names?: string };

    const pokemons = await fetchAllPokemons({
      search,
      types: types?.split(","),
      names: names?.split(","),
    });
    return res.status(200).send({ pokemons });
  } catch {
    console.error("Error fetching pokemons");
    return res.status(500).send({
      description: "Une erreur est survenue lors de la récupération des pokémons.",
    });
  }
});

/**
 * Ici pareillement, je créé une liste in memory pour éviter de faire des appels à pokebuildapi à chaque fois.
 */
let listPokemonTypes: PokemonType[] = [];

PokemonController.get("/types", async (_, res: Response) => {
  try {
    if (!listPokemonTypes.length) {
      const result = await axios.get<PokemonType[]>(`${POKEMON_API_URL}/types`);
      if (result.data) {
        listPokemonTypes = result.data;
      }
    }

    return res.status(200).send(listPokemonTypes);
  } catch (error) {
    console.error("Error fetching pokemon types", error);
    return res.status(500).send({
      description: "Une erreur est survenue lors de la récupération des types de pokémons.",
    });
  }
});

PokemonController.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pokemon = await fetchPokemonById(id);

    return res.status(200).send({ pokemon });
  } catch {
    return res.status(404).send({ error: "Pokemon not found" });
  }
});

export { PokemonController };
