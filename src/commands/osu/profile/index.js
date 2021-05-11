module.exports = {
    name: "profile",
    category: "osu",
    description: "Get your profile.",
    usage: "maybe add later",
    execute: (client, message, args) => {
        const User = require("../../../classes/User");
        if(args[0]) {
            let mod = "vn";
            let mode = "std";

            new User(args.join(" ").toLowerCase()).then(user => {
                const UserEmbed = new client.modules["discord.js"].MessageEmbed()
                    .setColor(client.config.application.color)
                    .setTitle(`${user.name}'s profile.`)
                    .setURL(new URL("/u/" + user.id, client.config.domains.osu))
                    .setDescription(
                        `**Rank**: #${user.global_rank} (#${user.country_rank}, ${(user.country !== "xx") ? `:flag_${user.country}:` : `:pirate_flag:`})\n` +
                        `**PP**: ${user.pp}pp\n` +
                        `**Accuracy**: ${user.accuracy.toFixed(2)}%\n`+ 
                        `**Playcount**: ${user.playcount} (${user.playtimeAgo})`)
                    .setFooter(`mod: ${mod} // mode: ${mode}`)
                    .setThumbnail(new URL(user.id, client.config.domains.avatar));
                message.channel.send(UserEmbed);
            }).catch(err => {
                if(err != "NOT_FOUND") return client.emit("error", err);
                
                message.channel.send(`\`\`${args.join(" ").replace("`", "")}\`\` couldn't be found.`);
            });
        } else return message.channel.send("Please enter a user.");
    }
}