module.exports = {
    name: "last",
    category: "osu",
    description: "Get recent osu play",
    usage: "maybe add later",
    execute: async (client, message, args) => {
        // i could use .then and .catch here but considering i have multiple classes that im instantiating i thought a try-catch is preferred to reduce code length even tho it might make it harder to pin down the code.
        if(!args[0]) return message.channel.send("Please enter a user.");
        try {
            const User = require("../../../classes/User");
            const Score = require("../../../classes/Score");
            const Beatmap = require("../../../classes/Beatmap");

            let user = await new User(args.join(" ").toLowerCase());
            let score = await Score.getScore({user_id: user.id, ascending: false});
            let beatmap = await Beatmap.getBeatmap(score.beatmap_md5);
            
            score.completion = score.getCompletion(beatmap);

            message.channel.send(`completion ${score.completion.toFixed(2)}%, event took ${client.modules["time"].clock(client.eventTimer)}ms.`);
        } catch(err) {
            if(err != "NOT_FOUND") return client.emit("error", err);
                
            message.channel.send(`\`\`${args.join(" ").replace("`", "")}\`\` couldn't be found.`);
        }
    }
}

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