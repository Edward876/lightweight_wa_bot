module.exports = {
    name: 'hi',
    description: 'Replies with a greeting message.',
    execute(message, socket) {
        const from = message.key.remoteJid;
        socket.sendMessage(from, { 
            text: 'Hello! How can I assist you today?' 
        }, { 
            quoted: message 
        });
    }
};
