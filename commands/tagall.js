module.exports = {
    name: 'tagall',
    description: 'Mentions all members in a group',
    async execute(message, socket) {
        const from = message.key.remoteJid;
        const groupMetadata = await socket.groupMetadata(from);
        const groupMembers = groupMetadata.participants;
        
        if (!message.key.participant) {
            return socket.sendMessage(from, { text: '*This command can only be used in a group.*' }, { quoted: message });
        }

        const sender = message.key.participant;
        const pushname = message.pushName;
        const isAdmin = groupMetadata.participants.find(participant => participant.id === sender)?.admin === 'admin' || groupMetadata.owner === sender;

        if (!isAdmin) {
            return socket.sendMessage(from, { text: '*You are not an admin of this group.*' }, { quoted: message });
        }

        const mentions = groupMembers.map(member => member.id);
        const text = `*Attention Everyone!*\n\nMessage by ${pushname} @${sender.split('@')[0]}`;
        console.log(mentions)
        await socket.sendMessage(from, { text, mentions }, { quoted: message });
    }
};
