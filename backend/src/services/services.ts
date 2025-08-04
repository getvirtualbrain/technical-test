import { ChatbotService } from "./ChatbotService";
import { ContentService } from "./ContentsService";
import { PokemonService } from "./PokemonService";

export const pokemonService = new PokemonService(process.env.POKEMON_API_URL);
export const contentsService = new ContentService(pokemonService);
export const chatbotService = new ChatbotService(process.env.CHATBOT_URL, process.env.CHATBOT_ID, process.env.CHATBOT_ACCESS_TOKEN);
