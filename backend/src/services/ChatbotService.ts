import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import { MissingChatbotIdError } from "../errors/MissingChatbotIdError";
import { MissingChatbotTokenError } from "../errors/MissingChatbotTokenError";
import { MissingChatbotUrlError } from "../errors/MissingChatbotUrlError";

export class ChatbotService {
    private chatbotUrl: string;
    private chatbotId: string;
    private token: string;

    constructor(chatbotUrl: string | undefined, chatbotId: string | undefined, token: string | undefined) {
        if (!chatbotUrl) {
            throw new MissingChatbotUrlError();
        }

        if (!chatbotId) {
            throw new MissingChatbotIdError();
        }

        if (!token) {
            throw new MissingChatbotTokenError();
        }

        this.chatbotUrl = chatbotUrl;
        this.chatbotId = chatbotId;
        this.token = token;
    }

    /**
     * Simulate a battle between two Pokémons
     * @param pokemon1 
     * @param pokemon2 
     * @returns 
     * @throws {Error} If the battle simulation fails
     */
    async simulateBattleStream(pokemon1: string, pokemon2: string): Promise<NodeJS.ReadableStream> {
        const query = `
        - Simulate a Pokémon battle between ${pokemon1} and ${pokemon2} in a very strict and technical way, exactly like in the official Pokémon games.
        - Output only the battle log. Do not add explanations, comments, or introductions.
        - Use numbered rounds.
        - For each round: State which Pokémon attacks. State the attack name. Show the damage dealt. Specify whether the attack is "super effective", "not very effective", or "no effect". Show the remaining HP of both Pokémon after the attack.
        - Continue until one Pokémon’s HP reaches 0.
        - When a Pokémon faints, just write "[Pokémon name] fainted." and stop.
        - Do not add any flavor text, extra explanations, or summaries.
        - If you don't know the pokemon stats just improvise and imagine them.

        Format example:
        Round 1: Pikachu uses Thunderbolt on Squirtle – 32 damage (super effective)
        HP: Pikachu 100 / 100, Squirtle 68 / 100
        Round 2: Squirtle uses Water Gun on Pikachu – 14 damage (not very effective)
        HP: Pikachu 86 / 100, Squirtle 68 / 100
        Round 3: Pikachu uses Thunderbolt on Squirtle – 28 damage (super effective)
        HP: Pikachu 86 / 100, Squirtle 40 / 100
        Round 4: Pikachu uses Thunderbolt on Squirtle – 40 damage (super effective)
        HP: Pikachu 86 / 100, Squirtle 0 / 100
        Squirtle fainted.
        `
        const url = `${this.chatbotUrl}/${this.chatbotId}/query?query=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        });

        if (!response.ok || !response.body) {
            console.error(response)
            const text = await response.text();
            throw new Error(`Failed to fetch from VirtualBrain: ${response.statusText} ${text}`);
        }

        return Readable.fromWeb(response.body as ReadableStream);
    }
}
