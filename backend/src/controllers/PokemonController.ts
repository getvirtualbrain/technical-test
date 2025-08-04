import axios from "axios";
import { type Request, type Response, Router } from "express";
import { POKEMON_API_URL } from "../constants/urls";

const PokemonController = Router();

export interface PokemonType {
  name: string;
  image: string;
}

export interface StatBlock {
  HP: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
}

export type DamageRelation =
  | "neutral"
  | "resistant"
  | "twice_resistant"
  | "vulnerable"
  | "twice_vulnerable"
  | "immune";

export interface Resistance {
  name: string;
  damage_multiplier: number;
  damage_relation: DamageRelation;
}

export interface Ability {
  name: string;
  slug: string;
}

export interface Evolution {
  name: string;
  pokedexId: number;
}

export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  image: string;
  sprite: string;
  slug: string;
  stats: StatBlock;
  apiTypes: PokemonType[];
  apiGeneration: number;
  apiResistances: Resistance[];
  resistanceModifyingAbilitiesForApi: Ability;
  apiEvolutions: Evolution[];
  apiPreEvolution: string | "none" | Evolution[];
  apiResistancesWithAbilities: Resistance[];
}

export let POKEMON_CACHE: Pokemon[] | [] = [];

PokemonController.get("/types", async (_req: Request, res: Response) => {
  const result = await axios.get(`${POKEMON_API_URL}/types`);

  const types = result.data as PokemonType[];

  return res.status(200).send({ types });
});

PokemonController.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await axios.get(`${POKEMON_API_URL}/pokemon/${id}`);

  const pokemon = result.data as Pokemon;

  return res.status(200).send({ pokemon });
});

PokemonController.get("/", async (_req: Request, res: Response) => {
  let pokemons;
  if (!POKEMON_CACHE.length) {
    const result = await axios.get<Pokemon[]>(`${POKEMON_API_URL}/pokemon`);
    pokemons = result.data;
    POKEMON_CACHE = pokemons;
  } else {
    pokemons = POKEMON_CACHE;
  }
  const nameFilter =
    typeof _req.query.name === "string" ? _req.query.name.toLowerCase() : "";
  const typesFilter =
    typeof _req.query.types === "string"
      ? _req.query.types
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : [];

  const filtered = pokemons.filter((p) => {
    if (nameFilter && !p.name.includes(nameFilter)) return false;
    if (typesFilter.length > 0) {
      const pokemonTypeNames = p.apiTypes.map((t) => t.name.toLowerCase());
      const hasType = typesFilter.some((t) => pokemonTypeNames.includes(t));
      if (!hasType) return false;
    }
    return true;
  });

  res.json({ pokemons: filtered });
});

export { PokemonController };
