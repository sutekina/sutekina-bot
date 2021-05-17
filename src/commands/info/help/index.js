module.exports = {
    name: "help",
    category: "info",
    description: "List all commands.",
    usage: "maybe add later",
    parameters: [],
    execute: (client, message) => {
        let HelpEmbed = new client.modules["discord.js"].MessageEmbed()
            .setColor(client.config.application.color)
            .setTitle(`${client.config.application.name} commands`)
            .setDescription(`prefix: \`${client.config.application.prefix}\`, parameter prefix: \` -\``)
            .setFooter(`${client.config.application.name}@${client.config.application.version}`, `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}`);

        if(message.args[1] && client.commands.filter(cmd => cmd.category === message.args[0] && cmd.name === message.args[1])) {
            let cmd = client.commands.filter(cmd => cmd.name === message.args[1]).first();
            HelpEmbed.addField(cmd.name,`description: ${cmd.description}\n\`\`\`usage: ${cmd.usage}\nparameters: ${cmd.parameters.join(", ")}\`\`\``, false)
        } else if(message.args[0] && client.commandCategories.includes(message.args[0])) {
            client.commands.filter(cmd => cmd.category === message.args[0]).every(cmd => HelpEmbed.addField(cmd.name, cmd.description, false));
        } else {
            client.commandCategories.map(cat => {
                let catCmds = [];
                client.commands.filter(cmd => cmd.category === cat).every(cmd => catCmds.push(cmd.name));
                if(catCmds.length > 0) {
                    HelpEmbed.addField(cat, catCmds.join(", "), false)
                }
            });
        }

        message.channel.send(HelpEmbed);
    }
}