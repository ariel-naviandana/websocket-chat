export interface IChatService {
    saveMessage(data: MessageData): Promise<void>
    getMessages(): Promise<Message[]>
    updateMessageStatus(id: number, status: string): Promise<void>
}

export interface MessageData {
    text: string
    senderId: string
    imageUrl?: string
    createdAt: Date
    status?: string
}

export interface Message {
    id: number
    text: string
    senderId: string
    imageUrl?: string
    createdAt: Date
    updatedAt: Date
    status?: string
}