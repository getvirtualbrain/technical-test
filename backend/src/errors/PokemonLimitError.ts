export class PokemonLimitError extends Error {
  constructor(public readonly limit: number) {
    super(`Limit must be less or equal to 898. Provided: ${limit}`);
    this.name = "PokemonLimitError";
  }
}
