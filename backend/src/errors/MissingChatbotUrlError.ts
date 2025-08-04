export class MissingChatbotUrlError extends Error {
    constructor() {
        super("CHATBOT_API_URL is not set in the environment variables.");
        this.name = "MissingChatbotUrlError";
    }
}