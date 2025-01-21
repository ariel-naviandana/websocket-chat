import { info } from '../helpers/logger'

export default (ws, chatService) => {
    ws.on('message', async (message) => {
        info(`Received message: ${message}`)
        await chatService.addMessage(message, 'client')
        ws.send(JSON.stringify({ content: message, sender: 'client', timestamp: new Date() }))
    })

    ws.on('typing', () => {
        info('Client is typing...')
    })
}