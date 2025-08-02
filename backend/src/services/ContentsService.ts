import { Pokemon } from '@shared/types';
import fs from "fs/promises";
import json2md from 'json2md';
import path from 'path';
import { PokemonFileNotFoundError } from '../errors/PokemonFileNotFoundError';
import { PokemonService } from './PokemonService';

const EXPORT_DIR = path.join(process.cwd(), "export");

export class ContentService {
    constructor(private pokemonService: PokemonService) { }

    private toMarkdown(pokemon: Pokemon): string {
        return json2md([
            { h1: pokemon.name },
            { p: `ID: ${pokemon.id}` },
            { img: { title: pokemon.name, source: pokemon.image } },
            { h2: "Stats" },
            {
                ul: [
                    `HP: ${pokemon.stats.HP}`,
                    `Attack: ${pokemon.stats.attack}`,
                    `Defense: ${pokemon.stats.defense}`,
                    `Speed: ${pokemon.stats.speed}`
                ]
            },
            { h2: "Types" },
            {
                ul: pokemon.apiTypes.map((t) => `${t.name} (${t.image})`)
            }
        ]);
    }

    private async ensureExportDir(): Promise<void> {
        await fs.mkdir(EXPORT_DIR, { recursive: true });
    }

    private async saveMarkdownFile(pokemon: Pokemon): Promise<void> {
        await fs.mkdir(EXPORT_DIR, { recursive: true });
        const filePath = path.join(EXPORT_DIR, `${pokemon.id}.md`);
        await fs.writeFile(filePath, this.toMarkdown(pokemon), "utf8");
    }

    /**
     * Export all Pokémon into markdown files (one time job)
     */
    private async saveAllPokemonsAsMarkdown(): Promise<void> {
        console.log("Saving all Pokemon as markdown files...");
        const pokemons = await this.pokemonService.getAllPokemons();
        await fs.mkdir(EXPORT_DIR, { recursive: true });

        for (const p of pokemons) {
            await this.saveMarkdownFile(p);
        }

        console.log("All Pokemon saved as markdown files.");
    }

    /**
     * Get all Pokémon IDs from markdown files
     */
    async getAllPokemonsAsMarkdown(): Promise<string[]> {
        await this.ensureExportDir();
        let files = await fs.readdir(EXPORT_DIR);

        if (files.length === 0) {
            await this.saveAllPokemonsAsMarkdown();
            files = await fs.readdir(EXPORT_DIR);
        }

        const mdFiles = files.filter(f => f.endsWith(".md"));

        const contents = await Promise.all(
            mdFiles.map(file => {
                const filePath = path.join(EXPORT_DIR, file);
                return fs.readFile(filePath, "utf8");
            })
        );

        return contents;
    }

    /**
     * Read a markdown file for a specific Pokémon
     */
    async getPokemonAsMarkdown(pokemonId: string): Promise<string> {
        await this.ensureExportDir();

        let files = await fs.readdir(EXPORT_DIR);

        // If no files are found, save all Pokémon as markdown files
        if (files.length === 0) {
            await this.saveAllPokemonsAsMarkdown();
            files = await fs.readdir(EXPORT_DIR);
        }

        const file = files.find((f) => f.match(`${pokemonId}.md`));

        if (!file) {
            throw new PokemonFileNotFoundError(pokemonId);
        }

        const filePath = path.join(EXPORT_DIR, file);
        return await fs.readFile(filePath, "utf8");
    }
}
