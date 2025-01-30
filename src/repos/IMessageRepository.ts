export interface IMessageRepository {
    saveMessage(data: MessageData): Promise<void>;
    getMessages(): Promise<Message[]>;
}

// Definisikan tipe data untuk Message dan MessageData
export interface MessageData {
    text: string;
    senderId: string;
    imageUrl?: string;
    createdAt?: Date;
}

export interface Message {
    id: number;
    text: string;
    senderId: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}