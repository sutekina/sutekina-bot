module.exports = {
    name: "last",
    category: "osu",
    description: "Get recent osu play",
    usage: "maybe add later",
    parameters: ["mod", "mode", "index"],
    execute: async (client, message) => {
        if(!message.args[0]) return message.channel.send("Please enter a user.");
        
        const enums = require("../../../enum/");
        let username = message.args.join(" ").toLowerCase().split(" -")[0];
        let mod = (enums.mods.gameMods.includes(message.params.mod)) ? message.params.mod : "vn";
        let mode = (enums.mode[message.params.mode]) ? message.params.mode : "std";
        let index = (parseInt(message.params.index) && typeof parseInt(message.params.index) === "number" && parseInt(message.params.index) >= 0) ? parseInt(message.params.index) : 0;
        
        try {
            const User = require("../../../classes/User");
            const ScoreList = require("../../../classes/ScoreList");
            const user = await new User(username, mod, mode);
            const score = (await new ScoreList({user_id: user.id, ascending: false, mods: mod, mode: mode, offset: Math.floor(index / 1), limit: 1, ranked: false}))[0];
            const beatmap = await score.beatmap;

            const embed = new client.modules["discord.js"].MessageEmbed()
                .setColor(client.config.application.color)
                .setAuthor(`${beatmap.artist} - ${beatmap.title} [${beatmap.difficulty}]`, new URL(user.id, client.config.domains.avatar), new URL("/b/" + beatmap.beatmap_id, client.config.domains.osu))
                .setDescription(
                    `**score set**: \`${client.modules["time"].ago.long(score.play_time)}\` (${(await beatmap.getStarRating(score)).total.toFixed(2)}\* / ${Math.round(beatmap.getBPM(score))}bpm)\n` +
                    `**pp**: ${score.pp.toFixed(2)}pp ` + await (async () => { let {pp, accuracy} = await score.getFCPP(beatmap); string = (pp) ? `=> ${pp.toFixed(2)}pp (with ${accuracy.toFixed(2)}%)` : `=> Full Combo`; return string; })() + ` (${(score.mod_list[0]) ? score.mod_list.map(m => enums.mods.bitwiseEmojis[m]).join("") : enums.mods.bitwiseEmojis[0]})\n` +
                    `**acc**: *${score.accuracy.toFixed(2)}%* => (${enums.grades[score.grade]}, ${score.hits_300}/${score.hits_100}/${score.hits_50}/${score.hits_miss})\n` +
                    `**completion**: *${(await score.getCompletion(beatmap)).toFixed(2)}%* (x${score.max_combo}/${beatmap.max_combo})`)
                .setFooter(`player: ${user.name} // ${mod}/${mode}/${index} // (${client.modules["time"].clock(client.eventTimer)}ms/${client.ws.ping}ms)`)
                .setThumbnail(new URL(`/thumb/${beatmap.beatmapset_id}.jpg`, client.config.domains.beatmap));
            message.channel.send(embed);
        } catch(err) {
            if(!new RegExp(/NOT_FOUND|INVALID_MODE/).test(err)) {
                message.channel.send("There was an issue trying to retrieve recent plays, please report this on our github or report it to an administrator.");
                return client.emit("error", err);
            };
            
            message.channel.send(`\`\`${username.replace("`", "")}\`\` couldn't be found. CODE: \`${err}\`.`);
        }
    }
}