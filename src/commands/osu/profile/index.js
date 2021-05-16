module.exports = {
    name: "profile",
    category: "osu",
    description: "Get your profile.",
    usage: "maybe add later",
    execute: async (client, message) => {
        if(!message.args[0]) return message.channel.send("Please enter a user.");
        
        const enums = require("../../../enum/");
        let username = message.args.join(" ").toLowerCase().split(" -")[0];
        let mod = (enums.mods.gameMods.includes(message.params.mod)) ? message.params.mod : "vn";
        let mode = (enums.mode[message.params.mode]) ? message.params.mode : "std";
        
        try {
            const User = require("../../../classes/User");
            const user = await new User(username);

            const embed = new client.modules["discord.js"].MessageEmbed()
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

            message.channel.send(embed);
        } catch(err) {
            if(!new RegExp(/NOT_FOUND|INVALID_MODE/).test(err)) {
                message.channel.send("There was an issue trying to retrieve recent plays.");
                return client.emit("error", err);
            };
            
            message.channel.send(`\`\`${username.replace("`", "")}\`\` couldn't be found. ${err}`);
        }
    }
}