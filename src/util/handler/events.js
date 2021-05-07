const path = require("path");
const fs = require("fs");

const eventsPath = path.join(__dirname, "../../events");

module.exports = (client) => {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    eventFiles.map(file => {
        const event = require(path.join(eventsPath, file));
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    });
};