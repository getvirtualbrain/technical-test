export class PokemonFileNotFoundError extends Error {
    constructor(public readonly pokemonId: string) {
        super(`Markdown file not found for Pokémon ID: ${pokemonId}`);
        this.name = "PokemonFileNotFoundError";
    }
}
