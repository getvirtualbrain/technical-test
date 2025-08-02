import { Pokemon } from '@shared/types'
import axios from 'axios'
import { type Request, type Response, Router } from 'express'
const PokemonController = Router()
const POKEMON_API_URL = 'https://pokebuildapi.fr/api/v1'

/**
 * Get a pokemon by id
 * @route GET /pokemons/:id
 * @group Pokemons
 * @param {string} id.path.required - Pokemon ID
*/
PokemonController.get(
	'/:id',
	async (req: Request, res: Response) => {
		const { id } = req.params

		const result = await axios.get(`${POKEMON_API_URL}/pokemon/${id}`)

		const pokemon = result.data as Pokemon

		return res.status(200).send({ pokemon })
	}
)

/**
 * Get all pokemons
 * @route GET /pokemons
 * @group Pokemons
*/
PokemonController.get(
	'/',
	async (req: Request, res: Response) => {
		const result = await axios.get(`${POKEMON_API_URL}/pokemon`)

		const pokemons = result.data as Pokemon[]

		return res.status(200).send({ pokemons })
	}
)

/**
 * Get 100 pokemons
 * @route GET /pokemons
 * @group Pokemons
*/
PokemonController.get(
	'/limit/100',
	async (req: Request, res: Response) => {
		const result = await axios.get(`${POKEMON_API_URL}/pokemon/limit/100`)

		const pokemons = result.data as Pokemon[]

		return res.status(200).send({ pokemons })
	}
)

export { PokemonController }
