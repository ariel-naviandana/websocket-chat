import {Message, MessageData} from "./IChatService"

export interface IBotService {
    processMessage(message: { text: string }): Promise<string | null>
    updateMessageStatus(id: number, status: string): Promise<Message>
    saveMessage(data: MessageData): Promise<Message>
}