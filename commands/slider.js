module.exports = {
    name: 'slider',
    description: 'Sends a simulated image slider using a list message.',
    async execute(message, socket) {
        const from = message.key.remoteJid;

        // Image URLs and descriptions
        const products = [
            { title: 'Standout Pizza', description: 'Delicious Standout Pizza', url: 'https://wallpapercave.com/wp/wp6127535.jpg' },
            { title: 'Triple Standout Deal', description: '3 Pizzas @ 199 each!', url: 'https://i.pinimg.com/originals/77/99/36/779936c156c84ff40fa49ce8d917b0e8.jpg' },
        ];

        // Construct the sections and rows for the List Message
        const sections = [{
            title: "Our Special Offers",
            rows: products.map((product, index) => ({
                title: product.title,
                description: product.description,
                rowId: `product_${index + 1}`
            }))
        }];

        // Create a List Message to simulate the carousel
        const listMessage = {
            text: 'Check out our latest offers!',
            footer: 'Swipe to see more',
            title: 'Pizza Offers',
            buttonText: 'View Offers',
            sections: sections,
        };

        // Send the List Message
        await socket.sendMessage(from, { listMessage });
    }
};
