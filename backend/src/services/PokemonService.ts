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

    async getAllPokemons(typesFilter?: string[], nameFilter?: string): Promise<Pokemon[]> {
        const pokemons = await axios.get(`${this.apiUrl}/pokemon`);

        const filteredPokemons = pokemons.data.filter((pokemon: Pokemon) => {
            let matchesName = true;
            let matchesType = true;

            // Name filter
            if (nameFilter) {
                const pokemonName = pokemon.name.toLowerCase();
                if (!pokemonName.startsWith(nameFilter.toLowerCase())) {
                    matchesName = false;
                }
            }

            // Type filter
            if (typesFilter && typesFilter.length > 0) {
                // Check if the pokemon has at least one type in the list
                const pokemonTypes = pokemon.apiTypes.map((t) => t.name.toLowerCase());
                const hasMatch = typesFilter.some((type) =>
                    pokemonTypes.includes(type.toLowerCase())
                );
                if (!hasMatch) {
                    matchesType = false;
                }
            }

            return matchesName && matchesType;
        });

        return filteredPokemons;
    }

    async getAllTypes(): Promise<string[]> {
        console.error(this.apiUrl);
        const result = await axios.get(`${this.apiUrl}/types`);
        return result.data as string[];
    }

    async getPokemonsByLimit(limit: number): Promise<Pokemon[]> {
        if (limit > 898) {
            throw new PokemonLimitError(limit);
        }

        const result = await axios.get(`${this.apiUrl}/pokemon/limit/${limit}`);
        return result.data as Pokemon[];
    }
}