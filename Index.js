const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const fs = require('fs')

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('session')
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    })

    sock.ev.on('creds.update', saveCreds)
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('Connection closed. Reconnecting...', shouldReconnect)
            if(shouldReconnect) start()
        } else if(connection === 'open') {
            console.log('MINHO-MD Connected ✅')
        }
    })
}
start()
