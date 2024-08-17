const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const QRCode = require('qrcode');
const path = require('path');

async function connectToWhatsApp() {
    console.log('Initializing WhatsApp connection...');

    const { state, saveCreds } = await useMultiFileAuthState('session');

    const socket = makeWASocket({
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,  // Disable printing the QR code directly to the terminal
    });

    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('QR Code received, generating QR image...');
            const qrImagePath = path.join(__dirname, 'qr-code.png');
            
            try {
                await QRCode.toFile(qrImagePath, qr, { width: 150, height: 150 });  // Set a smaller size for the QR code image
                console.log(`QR Code saved to ${qrImagePath}`);
            } catch (error) {
                console.error('Failed to save QR code image:', error);
            }

            QRCode.toString(qr, { type: 'terminal', small: true }, (err, url) => {  // Use the `small` option to reduce terminal QR code size
                if (err) console.error('Failed to display QR code in terminal:', err);
                console.log(url);
            });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log('Connection closed, reconnecting...');
                connectToWhatsApp();
            } else {
                console.log('Logged out from WhatsApp');
            }
        } else if (connection === 'open') {
            console.log('Connected to WhatsApp');
        }
    });

    socket.ev.on('creds.update', saveCreds);

    return socket;
}

module.exports = connectToWhatsApp;
