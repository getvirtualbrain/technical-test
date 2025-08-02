import { type Request, type Response, Router } from "express";
import { PokemonLimitError } from "../errors/PokemonLimitError";
import { pokemonService } from "../services/services";

const PokemonController = Router();

/**
 * Get a pokemon by id
 * @route GET /pokemons/:id
 * @group Pokemons
 */
PokemonController.get("/:id", async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const pokemon = await pokemonService.getPokemonById(id);
		return res.status(200).send({ pokemon });
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: "Failed to fetch pokemon" });
	}
});

/**
 * Get all pokemons
 * @route GET /pokemons
 * @group Pokemons
 */
PokemonController.get("/", async (_req: Request, res: Response) => {
	try {
		const pokemons = await pokemonService.getAllPokemons();
		return res.status(200).send({ pokemons });
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: "Failed to fetch pokemons" });
	}
});

/**
 * Get 100 pokemons
 * @route GET /pokemons/limit/:limit
 * @group Pokemons
 */
PokemonController.get("/limit/:limit", async (req: Request, res: Response) => {
	try {
		const { limit } = req.params;

		if (!limit) {
			return res.status(400).send({ error: "Limit is required" });
		}

		const limitNumber = Number(limit);
		if (isNaN(limitNumber)) {
			return res.status(400).send({ error: "Limit must be a number" });
		}

		const pokemons = await pokemonService.getPokemonsByLimit(limitNumber);

		return res.status(200).send({ pokemons });
	} catch (err) {
		console.error(err);

		if (err instanceof PokemonLimitError) {
			return res.status(400).send({ error: err.message });
		}

		return res.status(500).send({ error: "Failed to fetch pokemons" });
	}
});

export { PokemonController };
