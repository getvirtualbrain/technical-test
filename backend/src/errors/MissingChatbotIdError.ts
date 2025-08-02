export class MissingChatbotIdError extends Error {
    constructor() {
        super("CHATBOT_ID is not set in the environment variables.");
        this.name = "MissingChatbotIdError";
    }
}