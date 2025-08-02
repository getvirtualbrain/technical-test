export class MissingChatbotTokenError extends Error {
    constructor() {
        super("Missing VirtualBrain token");
        this.name = "MissingChatbotTokenError";
    }
}