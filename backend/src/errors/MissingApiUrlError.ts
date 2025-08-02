export class MissingApiUrlError extends Error {
    constructor() {
        super("POKEMON_API_URL is not set in the environment variables.");
        this.name = "MissingApiUrlError";
    }
}
