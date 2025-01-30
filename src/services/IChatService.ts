export interface IChatService {
    saveMessage(data: MessageData): Promise<void>;
    getMessages(): Promise<Message[]>;
}

export interface MessageData {
    text: string;
    senderId: string;
    imageUrl?: string; // Ubah tipe dari `string | null` menjadi `string | undefined`
    createdAt: Date;
}

export interface Message {
    id: number;
    text: string;
    senderId: string;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}