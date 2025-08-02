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

    async getPokemonById(id: string): Promise<Pokemon> {
        const result = await axios.get(`${this.apiUrl}/pokemon/${id}`);
        return result.data as Pokemon;
    }

    async getAllPokemons(): Promise<Pokemon[]> {
        const result = await axios.get(`${this.apiUrl}/pokemon`);
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