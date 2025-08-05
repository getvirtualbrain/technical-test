import axios from 'axios'
import { type Request, type Response, Router } from 'express'

const PokemonController = Router()
const POKEMON_API_URL = 'https://pokebuildapi.fr/api/v1'

export interface PokemonType {
	name: string;
	image: string;
}

export interface StatBlock {
	HP: number;
	attack: number;
	defense: number;
	special_attack: number;
	special_defense: number;
	speed: number;
}

export type DamageRelation =
	| "neutral"
	| "resistant"
	| "twice_resistant"
	| "vulnerable"
	| "twice_vulnerable"
	| "immune";

export interface Resistance {
	name: string;
	damage_multiplier: number;
	damage_relation: DamageRelation;
}

export interface Ability {
	name: string;
	slug: string;
}

export interface Evolution {
	name: string;
	pokedexId: number;
}

export interface Pokemon {
	id: number;
	pokedexId: number;
	name: string;
	image: string;
	sprite: string;
	slug: string;
	stats: StatBlock;
	apiTypes: PokemonType[];
	apiGeneration: number;
	apiResistances: Resistance[];
	resistanceModifyingAbilitiesForApi: Ability;
	apiEvolutions: Evolution[];
	apiPreEvolution: string | "none";
	apiResistancesWithAbilities: Resistance[];
}


PokemonController.get(
	'/:id',
	async (req: Request, res: Response) => {
		const { id } = req.params

		console.log('coucou')
		const result = await axios.get(`${POKEMON_API_URL}/pokemon/${id}`)

		const pokemon = result.data as Pokemon

		return res.status(200).send({pokemon})
	}
)

export { PokemonController }
