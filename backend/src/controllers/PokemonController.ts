import { type Request, type Response, Router } from "express";
import { PokemonLimitError } from "../errors/PokemonLimitError";
import { chatbotService, pokemonService } from "../services/services";


const PokemonController = Router();

/**
 * Get a pokemon by id or
 * @route GET /pokemons/:idOrName
 * @group Pokemons
 */
PokemonController.get("/:idOrName", async (req: Request, res: Response) => {
	try {
		const { idOrName } = req.params;
		const pokemon = await pokemonService.getPokemonByIdOrName(idOrName);
		return res.status(200).send({ pokemon });
	} catch (err) {
		if (err instanceof Error && err.message.includes("404")) {
			return res.status(404).send({ error: err.message });
		}

		console.error(err);
		return res.status(500).send({ error: "Failed to fetch pokemon" });
	}
});

/**
 * Get all pokemons
 * @route GET /pokemons
 * @group Pokemons
 * @param {string} [name.query] - Optional filter: only return Pokemon whose name starts with this value (case-insensitive)
 */
PokemonController.get("/", async (_req: Request, res: Response) => {
	try {
		const nameFilter = _req.query.name?.toString().toLowerCase();
		const pokemons = await pokemonService.getAllPokemons(nameFilter);
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

/**
 * Simulate a battle between two Pokémons
 * @route GET /pokemons/battle/:id1/:id2
 * @group Pokemons
 */
PokemonController.get("/battle/:id1/:id2", async (req: Request, res: Response) => {
	try {
		const { id1, id2 } = req.params;

		const n1 = Number(id1);
		const n2 = Number(id2);

		if (
			isNaN(n1) || isNaN(n2) ||
			n1 < 1 || n1 > 898 ||
			n2 < 1 || n2 > 898
		) {
			return res.status(400).send({ error: "Both IDs must be numbers between 1 and 898." });
		}

		const [pokemon1, pokemon2] = await Promise.all([
			pokemonService.getPokemonByIdOrName(id1),
			pokemonService.getPokemonByIdOrName(id2)
		]);

		const stream = await chatbotService.simulateBattleStream(pokemon1.name, pokemon2.name);

		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.setHeader("Transfer-Encoding", "chunked");

		stream.pipe(res);
		stream.on("end", () => res.end());
		stream.on("error", (err) => {
			console.error("Streaming error:", err);
			res.end();
		});

	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: "Failed to fetch battle data" });
	}
});


export { PokemonController };
