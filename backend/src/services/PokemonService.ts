import { Pokemon } from "@shared/types";
import axios from "axios";
import { MissingApiUrlError } from "../errors/MissingApiUrlError";
import { PokemonLimitError } from "../errors/PokemonLimitError";


export class PokemonService {
    private apiUrl: string;

    constructor(apiUrl: string | undefined) {
        if (!apiUrl) {
            throw new MissingApiUrlError();
        }
        this.apiUrl = apiUrl;
    }

    async getPokemonByIdOrName(idOrName: string): Promise<Pokemon> {
        const result = await axios.get(`${this.apiUrl}/pokemon/${idOrName}`);
        return result.data as Pokemon;
    }

    async getAllPokemons(nameFilter?: string): Promise<Pokemon[]> {
        const result = await axios.get(`${this.apiUrl}/pokemon`);

        if (nameFilter) {
            return result.data.filter((pokemon: Pokemon) => pokemon.name.toLowerCase().startsWith(nameFilter.toLowerCase()));
        }

        return result.data as Pokemon[];
    }

    async getPokemonsByLimit(limit: number): Promise<Pokemon[]> {
        if (limit > 898) {
            throw new PokemonLimitError(limit);
        }

        const result = await axios.get(`${this.apiUrl}/pokemon/limit/${limit}`);
        return result.data as Pokemon[];
    }
}