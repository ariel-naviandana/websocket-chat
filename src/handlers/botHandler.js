import { info } from '../helpers/logger'

export default (ws, chatService) => {
    ws.on('message', async (message) => {
        info(`Received message from bot: ${message}`)
        await chatService.addMessage(message, 'bot')
        ws.send(JSON.stringify({ content: message, sender: 'bot', timestamp: new Date() }))
    })
}