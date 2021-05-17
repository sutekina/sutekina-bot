const SutekinaClient = require("../index");
const Score = require("./Score");

class ScoreList {
    constructor({user_id = 1, mods = "vn", mode = 0, sort = "play_time", ascending = false, offset = 0, limit = 3, status = undefined, ranked = true}) {
        return new Promise((resolve, reject) => {
            const parameters = [mode];
            if(user_id) parameters.unshift(user_id);
            if(status) parameters.push(status);
            let query = `SELECT s.id score_id, s.map_md5 beatmap_md5, score, pp, acc accuracy, s.max_combo, mods, n300 hits_300, n100 hits_100, n50 hits_50, nmiss hits_miss, grade, s.status, s.mode, play_time, time_elapsed, client_flags, userid user_id, perfect FROM osu.scores_${mods} s JOIN osu.maps m ON s.map_md5 = m.md5 WHERE ${(user_id) ? "userid = ? AND" : ""} ${(ranked) ? "m.status >= 2 AND" : ""} s.mode = ? ${(status) ? "AND s.status = ?" : ""} ORDER BY ${sort} ${(ascending === true) ? "ASC" : "DESC"} LIMIT ${limit} OFFSET ${offset};`;
            SutekinaClient.modules["logging"].trace(query, {query, parameters})
            SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (error, results) => {
                if(error) return reject(error);
                if(!results || !results[0]) return reject("NOT_FOUND");
                return resolve(results.map(score => new Score(score)));
            });
        });
    }
};

module.exports = ScoreList;