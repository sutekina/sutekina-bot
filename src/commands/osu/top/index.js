module.exports = {
    name: "top",
    category: "osu",
    description: "List a user's top plays.",
    usage: "maybe add later",
    parameters: ["mod", "mode", "index"],
    execute: async (client, message) => {
        if(!message.args[0]) return message.channel.send("Please enter a user.");

        const enums = require("../../../enum/");
        let username = message.args.join(" ").toLowerCase().split(" -")[0];
        let mod = (enums.mods.gameMods.includes(message.params.mod)) ? message.params.mod : "vn";
        let mode = (enums.mode[message.params.mode]) ? message.params.mode : "std";
        let limit = 3;
        let index = (parseInt(message.params.index) && typeof parseInt(message.params.index) === "number" && parseInt(message.params.index) >= 0) ? parseInt(message.params.index) * limit : 0;
        
        try {
            const User = require("../../../classes/User");
            const ScoreList = require("../../../classes/ScoreList");
            const user = await new User(username, mod, mode);
            const scores = await new ScoreList({user_id: user.id, mods: mod, mode: mode, offset: index, limit: limit, sort: "pp", status: 2});
            
            const embed = new client.modules["discord.js"].MessageEmbed()
                .setColor(client.config.application.color)
                .setAuthor(`${user.name}'s scores sorted by pp.`, new URL(user.id, client.config.domains.avatar), new URL("/u/" + user.id, client.config.domains.osu))
                .setFooter(`player: ${user.name} // ${mod}/${mode}/${index} // (${client.modules["time"].clock(client.eventTimer)}ms/${client.ws.ping}ms)`)

            for(let i = 0; i < scores.length; i++) {
                let s = scores[i];
                try {
                    let beatmap = await s.beatmap;
                    embed.addField(`${beatmap.artist} - ${beatmap.title} [${beatmap.difficulty}] `,                       
                        `**score set**: \`${client.modules["time"].ago.long(s.play_time)}\` (${(await beatmap.getStarRating(s)).total.toFixed(2)}\* / ${Math.round(beatmap.getBPM(s))}bpm)\n` +
                        `**pp**: ${s.pp.toFixed(2)}pp ` + await (async () => { let {pp, accuracy} = await s.getFCPP(beatmap); string = (pp) ? `=> ${pp.toFixed(2)}pp (with ${accuracy.toFixed(2)}%)` : `=> Full Combo`; return string; })() + ` (${(s.mod_list[0]) ? s.mod_list.map(m => enums.mods.bitwiseEmojis[m]).join("") : enums.mods.bitwiseEmojis[0]})\n` +
                        `**acc**: *${s.accuracy.toFixed(2)}%* => (${enums.grades[s.grade]}, ${s.hits_300}/${s.hits_100}/${s.hits_50}/${s.hits_miss}) (x${s.max_combo}/${beatmap.max_combo})`);
                } catch (err) {
                    continue;
                }
            }

            message.channel.send(embed);
        } catch(err) {
            if(!new RegExp(/NOT_FOUND|INVALID_MODE/).test(err)) {
                message.channel.send("There was an issue trying to retrieve top plays, please report this on our github or report it to an administrator.");
                return client.emit("error", err);
            };
            
            message.channel.send(`\`\`${username.replace("`", "")}\`\` couldn't be found. CODE: \`${err}\`.`);
        }
    }
}

