async function handleGroupEvents(socket) {
    socket.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;

        for (let participant of participants) {
            if (action === 'add') {
                const welcomeMessage = `Hello @${participant.split('@')[0]}! Welcome to the group!`;
                await socket.sendMessage(id, { 
                    text: welcomeMessage, 
                    mentions: [participant] 
                });
            } else if (action === 'remove') {
                const goodbyeMessage = `Goodbye @${participant.split('@')[0]}, you will be missed!`;
                await socket.sendMessage(id, { 
                    text: goodbyeMessage, 
                    mentions: [participant] 
                });
            } else if (action === 'promote') {
                console.log(`User @${participant.split('@')[0]} has been promoted in group ${id}`);
            } else if (action === 'demote') {
                console.log(`User @${participant.split('@')[0]} has been demoted in group ${id}`);
            }
        }
    });
}

module.exports = handleGroupEvents;
