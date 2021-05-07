module.exports = {
    name: "profile",
    category: "osu",
    description: "Get your profile.",
    usage: "maybe add later",
    execute: (client, message, args) => {
        const User = require("../../../classes/User");
        if(args[0]) {
            new User(args.join(" ").toLowerCase()).then(user => {
                console.log(new Date(user.creation_time * 1000).toISOString());
                console.log(client.modules["time"].timeAgo(86400))
                const UserEmbed = new client.modules["discord.js"].MessageEmbed()
                    .setColor(client.config.application.color)
                    .setTitle(`${args.join(" ")}'s ${client.config.application.name} profile.`);


                

                message.channel.send(UserEmbed);
            }).catch(err => {
                if(err != "NOT_FOUND") return client.emit("error", err);
                
                message.channel.send(`\`\`${args.join(" ").replace("`", "")}\`\` couldn't be found.`);
            });
        } else return message.channel.send("Please enter a user.");
    }
}