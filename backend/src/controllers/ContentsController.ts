import { type Request, type Response, Router } from 'express';
import { contentsService } from '../services/services';

const ContentController = Router()

/**
 * Save all pokemon as markdown in markdown folder
 * @route GET /contents/all
 * @group Contents
*/
ContentController.get(
	'/all',
	async (_req: Request, res: Response) => {
		try {
			await contentsService.saveAllPokemonsAsMarkdown();
			return res.sendStatus(200);
		} catch (err) {
			console.error(err);
			return res.status(500).send({ error: "Failed to save all pokemons as markdown" });
		}
	}
)

/**
 * Return a pokemon as markdown
 * @route GET /contents/:id
 * @group Contents
 * @param {string} id.path.required - Pokemon ID
*/
ContentController.get(
	'/:pokemonId',
	async (_req: Request, res: Response) => {
		const { pokemonId } = _req.params;
		try {
			await contentsService.getPokemonAsMarkdown(pokemonId);
			return res.sendStatus(200);
		} catch (err) {
			console.error(err);
			return res.status(500).send({ error: "Failed to get pokemon as markdown" });
		}
	}
)

export { ContentController };

