module.exports = {
    name: "message",
    once: false,
    execute: (message, client) => {
        if (!message.content.startsWith(client.config.application.prefix) || message.author.bot) return;
        client.eventTimer = client.modules["time"].clock();
        message.args = message.content.slice(client.config.application.prefix.length).trim().split(/ +/);
        let params = message.content.match(/(?<= -)[a-zA-Z0-9=)]*/gi); message.params = {}; message.params = {}; if(params) params.map(p => {if(!p) return; let ps = p.split(/=(.+)/); message.params[ps[0]] = ps[1]});
        const commandName = message.args.shift().toLowerCase();

        client.modules["logging"].trace(`possible command from U@${message.author.id} (G@${message.guild.id}), content: ${message.content}`)
        
        if (!client.commands.has(commandName)) return;
        
        client.modules["logging"].debug(`command from U@${message.author.id} (G@${message.guild.id}), content: ${message.content}`)
        
        const command = client.commands.get(commandName);
        
        try {
            command.execute(client, message, message.args);
        } catch (error) {
            message.reply('there was an error trying to execute that command!');
            client.emit("error", error);
        }
    }
};