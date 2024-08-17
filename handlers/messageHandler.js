const fs = require('fs');
const path = require('path');

async function handleMessages(socket) {
    const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
    const commands = new Map();

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        commands.set(command.name, command);
    }

    socket.ev.on('messages.upsert', async (msg) => {
        console.log('Received a message event');
        const messages = msg.messages;
        if (!messages || !messages[0]) return;

        const message = messages[0];
        const from = message.key.remoteJid;
        const type = message.message ? Object.keys(message.message)[0] : null;

        console.log(`Message received from ${from}, type: ${type}`);

        if (!message.key.fromMe && from && type) {
            const body = message.message.conversation || message.message.extendedTextMessage?.text || '';
            const prefix = '/';
            if (!body.startsWith(prefix)) return;

            const commandName = body.slice(prefix.length).trim().split(/ +/)[0].toLowerCase();

            console.log(`Command received: ${commandName}`);

            if (commands.has(commandName)) {
                try {
                    commands.get(commandName).execute(message, socket);
                } catch (error) {
                    console.error(`Error executing command ${commandName}:`, error);
                }
            } else {
                console.log(`No command found for: ${commandName}`);
            }
        }
    });
}

module.exports = handleMessages;
