const SutekinaClient = require("../index");

module.exports = class User {
    constructor(name, mods = "vn", mode = "std") {
        return new Promise((resolve, reject) => {
            this.getUser(name, mods, mode).then(res => {
                Object.keys(res).map(el => this[el] = res[el])
                resolve(this);
            }).catch(err => reject(err));
        });
    }

    getUser = (name, mods, mode) => {
        return new Promise((resolve, reject) => {
            SutekinaClient.modules["mysql2"].connection.execute(`SELECT u.id, u.name, u.country, u.priv, u.creation_time, s.playtime_${mods}_${mode}
            playtime, s.plays_${mods}_${mode} playcount, s.pp_${mods}_${mode} pp, s.acc_${mods}_${mode} accuracy, FIND_IN_SET(s.pp_${mods}_${mode}, (SELECT GROUP_CONCAT(pp_${mods}_${mode} ORDER BY pp_${mods}_${mode} DESC) FROM stats)) AS global_rank, FIND_IN_SET(s.pp_${mods}_${mode}, (SELECT GROUP_CONCAT(pp_${mods}_${mode} ORDER BY pp_${mods}_${mode} DESC) FROM stats s JOIN users u ON s.id = u.id AND u.country = "de" )) AS country_rank FROM stats s JOIN users u ON s.id = u.id WHERE u.priv >= 3 AND u.id = ? OR u.safe_name = ?; `, [name, name], (error, result)=> {
                if(error) reject(error);
                if(!result[0]) reject("NOT_FOUND");
                resolve(result[0]);
            });
        });
    }
}

//   id: 3,
//   name: 'Felix',
//   country: 'de',
//   priv: 31751,
//   creation_time: 1611740740,
//   playtime: 7375,
//   playcount: 293,
//   pp: 1025,
//   accuracy: 83.60299682617188,
//   global_rank: 19,
//   country_rank: 1

// leaderboard query SELECT u.id user_id, u.name username, u.country, tscore_vn_std tscore, rscore_vn_std rscore, pp_vn_std pp, plays_vn_std plays, playtime_vn_std playtime, acc_vn_std acc, max_combo_vn_std max_combo FROM stats JOIN users u ON stats.id = u.id WHERE pp_vn_std > 0 AND u.priv >= 3 ORDER BY pp_vn_std DESC LIMIT 50;