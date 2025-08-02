import { Pokemon } from '@shared/types'
import axios from 'axios'
import { type Request, type Response, Router } from 'express'
const PokemonController = Router()
const POKEMON_API_URL = 'https://pokebuildapi.fr/api/v1'




PokemonController.get(
	'/:id',
	async (req: Request, res: Response) => {
		const { id } = req.params

		const result = await axios.get(`${POKEMON_API_URL}/pokemon/${id}`)

		const pokemon = result.data as Pokemon

		return res.status(200).send({ pokemon })
	}
)

export { PokemonController }
