import archiver from "archiver";
import { type Request, type Response, Router } from "express";
import { sanitizeFilename } from "../constants/names";
import { pokemonToMarkdown } from "../utils/markdown";
import { POKEMON_CACHE } from "./PokemonController";
const ContentController = Router();

/**
 * Save all pokemon as markdown in markdown folder
 * @route GET /contents/all
 * @group Contents
 */
ContentController.get("/all", async (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="pokemons_markdown.zip"'
  );
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    console.error("Archive error", err);
    res.status(500).send("Erreur lors de la création de l'archive");
  });
  archive.pipe(res);

  for (const p of POKEMON_CACHE) {
    const md = pokemonToMarkdown(p);
    const filename = `${p.name.toLowerCase()}.md`;
    archive.append(md, { name: filename });
  }

  await archive.finalize();
});

/**
 * Return a pokemon as markdown
 * @route GET /contents/:id
 * @group Contents
 * @param {string} id.path.required - Pokemon ID
 */
ContentController.get("/:pokemonId", async (_req: Request, res: Response) => {
  const pokemon = POKEMON_CACHE.find(
    (p) => Number(p.pokedexId) === Number(_req.params.pokemonId)
  );
  if (!pokemon) {
    return res.status(404).send({ error: "Pokemon not found" });
  }

  const markdownPokemon = pokemonToMarkdown(pokemon);
  const filename = `${sanitizeFilename(pokemon.name.toLowerCase())}.md`;

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.send(markdownPokemon);
});

export { ContentController };
