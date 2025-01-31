export interface IChatService {
    saveMessage(data: MessageData): Promise<Message>
    getMessages(): Promise<Message[]>
    updateMessageStatus(id: number, status: string): Promise<Message>
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