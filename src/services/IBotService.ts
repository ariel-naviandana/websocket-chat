import {MessageData} from "./IChatService"

export interface IBotService {
    processMessage(message: { text: string }): Promise<string | null>
    updateMessageStatus(id: number, status: string): Promise<void>
    saveMessage(data: MessageData): Promise<void>
}