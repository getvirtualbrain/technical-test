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
        const query = `${pokemon1} and ${pokemon2}`;
        const url = `${this.chatbotUrl}/${this.chatbotId}/query?query=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.token}`
            }
        });

        if (!response.ok || !response.body) {
            const text = await response.text();
            throw new Error(`Failed to fetch from VirtualBrain: ${text}`);
        }

        return Readable.fromWeb(response.body as ReadableStream);
    }
}
