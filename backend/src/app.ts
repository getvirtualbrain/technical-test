
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { ContentController } from './controllers/ContentsController'
import { PokemonController } from './controllers/PokemonController'

/** App */
const app = express()

app.disable('x-powered-by')
const httpServer = createServer(app)

app.set('trust proxy', 1)
app.use(cors({
	origin: true,
	credentials: true,
	exposedHeaders: ['set-cookie']
}))

/**
 * Body parser
 */
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

/**
 * Routes
 */
app.use('/pokemons', PokemonController)
app.use('/contents', ContentController)
app.get('/ping', (_req, res) => res.status(200).send('pong'))


/* -------------------------- Start the application ------------------------- */

/**
 * Start server
 */
httpServer.listen(3001, () => {
	console.log('Server started on port:', 3001)
})