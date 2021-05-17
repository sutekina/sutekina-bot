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
            const Score = require("../../../classes/Score");
            const Beatmap = require("../../../classes/Beatmap");
            const user = await new User(username, mod, mode);
            const score = await Score.getScore({user_id: user.id, ascending: false, mods: mod, mode: mode, index: index});
            const beatmap = await Beatmap.getBeatmap(score.beatmap_md5);

            const embed = new client.modules["discord.js"].MessageEmbed()
                .setColor(client.config.application.color)
                .setTitle(`${beatmap.artist} - ${beatmap.title} [${beatmap.difficulty}]`)
                .setURL(new URL("/b/" + beatmap.beatmap_id, client.config.domains.osu))
                .addFields({name: `${index}. \`${client.modules["time"].ago.long(score.play_time)}\` (${(await beatmap.getStarRating(score)).total.toFixed(2)}* | ${beatmap.getBPM(score)}bpm)`, value:
                    `**PP**: ${score.pp.toFixed(2)}pp ` + await (async () => { let {pp, accuracy} = await score.getFCPP(beatmap); string = (pp) ? `=> ${pp.toFixed(2)}pp (with ${accuracy.toFixed(2)}%)` : `Full Combo`; return string; })() + ` (${score.hits_300}/${score.hits_100}/${score.hits_50}/${score.hits_miss})\n` +
                    `**Accuracy**: ${score.accuracy.toFixed(2)}% (${score.mod_list.map(m => enums.mods.bitwiseEmojis[m]).join("")}, ${enums.grades[score.grade]})\n` +
                    `**Completion**: ${(await score.getCompletion(beatmap)).toFixed(2)}% (x${score.max_combo}/${beatmap.max_combo})`
                })
                .setFooter(`player: ${user.name} // mod: ${mod} // mode: ${mode}`, new URL(user.id, client.config.domains.avatar))
                .setThumbnail(new URL(`/thumb/${beatmap.beatmapset_id}.jpg`, client.config.domains.beatmap));
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

// BOTTLENECKS:
// biggest bottleneck for this command at the moment is retrieving the beatmap from osu website, it's also bad because we are reliant on osu, this can take up to 300ms.
// possible solutions:
// download beatmap once if we dont already have it and then save it in folder, filestream is most likely quicker than requesting from website.
// 
// other bottlenecks:
// when total_length/max_combo is 0 we request the map from cheesegull, this is a problem because cheesegull is unreliant but since this shouldn't happen too often it's not that serious.

// Score {
//     score_id: "627",
//     map_md5: "670b363e29e43fb9dde0120f775c524e", 
//     score: "86010", 
//     pp: "0.000", 
//     accuracy: "85.938", 
//     max_combo: "25", 
//     mods: "0", 
//     hits_300: "145", 
//     hits_100: "0", 
//     hits_50: "75", 
//     hits_miss: "26", 
//     grade: "F", 
//     status: "0", 
//     mode: "2", 
//     play_time: "2021-01-30 22:35:12", 
//     time_elapsed: "44531", 
//     client_flags: "0", 
//     user_id: "4", 
//     perfect: 0
// }
// User {
//     getUser: [Function: getUser],
//     id: 88,
//     name: 'enri',
//     country: 'ph',
//     priv: 3,
//     creation_time: 1619804151,
//     playtime: 11985,
//     playcount: 299,
//     pp: 8320,
//     accuracy: 97.6259994506836,
//     global_rank: 1,
//     country_rank: 1
// }
// Beatmap {
//     server: 'osu!',
//     beatmap_id: 1989857,
//     beatmapset_id: 953015,
//     status: 2,
//     beatmap_md5: '5e148185865d4b9d317e7c67c037df49',
//     artist: 'Hikasa Youko, Uchida Maaya, Taketatsu Ayana, Akesaka Satomi',
//     title: 'Gokujo. no Jouken (TV Size)',
//     difficulty: 'Overflowing Emotions',
//     creator: 'Hanasaka Yui',
//     last_update: 2019-05-01T17:42:48.000Z,
//     total_length: 30,
//     max_combo: 175,
//     mode: 0,
//     base_bpm: 180.1999969482422
// }