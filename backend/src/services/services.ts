import { ContentService } from "./ContentsService";
import { PokemonService } from "./PokemonService";

export const pokemonService = new PokemonService(process.env.POKEMON_API_URL);
export const contentsService = new ContentService();
