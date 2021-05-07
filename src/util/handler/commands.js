const path = require("path");
const fs = require("fs");
module.exports = (modules) => {
    const commandsCollection = new modules["discord.js"].Collection();
    const categories = [];

    const commandsPath = path.join(__dirname, "../../commands");
    const commandFolders = fs.readdirSync(commandsPath);
    commandFolders.map(folder => {
        categories.push(folder);
        const commandGroup = fs.readdirSync(path.join(commandsPath, `${folder}`));
        commandGroup.map(file => {
            const command = require(path.join(commandsPath, `/${folder}/${file}`));
            if(command.name) commandsCollection.set(command.name, command);
        });
    });
    
    return [commandsCollection, categories];
}
