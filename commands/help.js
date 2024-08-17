const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Lists all available commands with descriptions using plain text.',
    async execute(message, socket) {
        const from = message.key.remoteJid;

        // Load all command files dynamically
        const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'));
        
        // Construct the help message with markdown
        let helpMessage = '*Available Commands*\n\n';
        commandFiles.forEach(file => {
            const command = require(`../commands/${file}`);
            helpMessage += `- *\`/${command.name}\`*\n> ${command.description}\n\n`;
        });

        // Send the text message
        await socket.sendMessage(from, { text: helpMessage }, {quoted : message});
    }
};
