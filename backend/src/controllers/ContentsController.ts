import { type Request, type Response, Router } from 'express'

const ContentController = Router()


/**
 * Save all pokemon as markdown in markdown folder
 * @route GET /contents/all
 * @group Contents
*/
ContentController.get(
	'/all',
	async (_req: Request, res: Response) => {
		return res.sendStatus(200)
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
		return res.sendStatus(200)
	}
)

export { ContentController }
