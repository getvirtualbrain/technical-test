import archiver from "archiver";
import { type Request, type Response, Router } from "express";

import { pokemonToMarkdown } from "@/services/ContentService";
import { fetchAllPokemons, fetchPokemonById } from "@/services/PokemonService";

const ContentController: Router = Router();

/**
 * Save all pokemon as markdown in markdown folder
 * @route GET /contents/all
 * @group Contents
 */
ContentController.get("/all", async (_req: Request, res: Response) => {
  try {
    const pokemons = await fetchAllPokemons();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=pokemons.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(res);

    pokemons.forEach((pokemon) => {
      const mdContent = pokemonToMarkdown(pokemon);
      archive.append(mdContent, { name: `${pokemon.slug}.md` });
    });

    await archive.finalize();
  } catch {
    return res.status(500).send({ error: "Failed to - generate Pokemon archive" });
  }
});

/**
 * Return a pokemon as markdown
 * @route GET /contents/:id
 * @group Contents
 * @param {string} id.path.required - Pokemon ID
 */
ContentController.get("/:pokemonId", async (req: Request, res: Response) => {
  try {
    const { pokemonId } = req.params;
    const pokemon = await fetchPokemonById(pokemonId);

    res.setHeader("Content-Type", "text/markdown");
    res.setHeader("Content-Disposition", `attachment; filename=${pokemon.slug}.md`);
    return res.send(pokemonToMarkdown(pokemon));
  } catch {
    return res.status(404).send({ error: "Pokemon not found" });
  }
});

export { ContentController };
