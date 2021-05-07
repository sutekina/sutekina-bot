module.exports = {
    name: "message",
    once: false,
    execute: (message, client) => {
        if (!message.content.startsWith(client.config.application.prefix) || message.author.bot) return;
    
        const args = message.content.slice(client.config.application.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
    
        if (!client.commands.has(commandName)) return;
    
        const command = client.commands.get(commandName);
    
        try {
            command.execute(client, message, args);
        } catch (error) {
            client.modules["logging"].error(error.message, error);
            message.reply('there was an error trying to execute that command!');
        }
    }
};