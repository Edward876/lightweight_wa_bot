const express = require('express');
const path = require('path');
const fs = require('fs');
const connectToWhatsApp = require('./handlers/connection');
const handleMessages = require('./handlers/messageHandler');
const handleGroupEvents = require('./handlers/groupHandler');

const app = express();
const port = process.env.PORT || 3000;

async function startBot() {
    const socket = await connectToWhatsApp();  // Establish connection once
    await handleMessages(socket);              // Pass the connection to message handler
    await handleGroupEvents(socket);           // Pass the same connection to group handler
}

app.get('/qr-code', (req, res) => {
    const qrImagePath = path.join(__dirname, 'handlers/qr-code.png');
    if (fs.existsSync(qrImagePath)) {
        res.sendFile(qrImagePath);
    } else {
        res.send('QR Code not generated yet.');
    }
});

startBot();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
