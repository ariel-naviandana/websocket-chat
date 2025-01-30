import { IBotService } from './IBotService';
import { IMessageRepository } from '../repos/IMessageRepository';  // Pastikan untuk menyesuaikan path impor sesuai dengan struktur proyek Anda

interface IMessage {
    text: string;
}

class BotService implements IBotService {
    private messageRepository: IMessageRepository;

    constructor({ messageRepository }: { messageRepository: IMessageRepository }) {
        this.messageRepository = messageRepository;
    }

    async processMessage(message: IMessage): Promise<string | null> {
        const keywords = ['help', 'info'];
        let response: string | null = null;

        for (const keyword of keywords) {
            if (message.text.toLowerCase().includes(keyword)) {
                response = `Bot received the keyword: ${keyword}`;
                break;
            }
        }

        return response;
    }
}

export default BotService;