export interface IBotService {
    processMessage(message: { text: string }): Promise<string | null>;
}