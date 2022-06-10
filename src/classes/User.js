const SutekinaClient = require("../index");

module.exports = class User {
    /**
     * @param {String} name - The username. 
     * @param {String} mod - The selected gamemod, not gamemode. This can be vn, rx or ap.
     * @param {String} mode - The selected gamemode. This can be std, taiko, catch or mania.
     * @returns {User} returns a Promise with the user object as resolve.
     */
    constructor(name, mod = "vn", mode = "std") {
        return new Promise((resolve, reject) => {
            this.getUser(name, mod, mode).then(res => {
                Object.assign(this, res);
                return resolve(this);
            }).catch(err => reject(err));
        });
    }

    /**
     * Don't use this function, it won't create a new User but will just return the user.
     * @param {String} name - The username. 
     * @param {String} mod - The selected gamemod, not gamemode. This can be vn, rx or ap.
     * @param {String} mode - The selected gamemode. This can be std, taiko, catch or mania.
     * @returns {User} returns a Promise with the user object as resolve.
     */
    getUser = (name, mod, mode) => {
        return new Promise((resolve, reject) => {
            // you cant have any of these combinations.
            if(mod === "rx" && mode === "mania") return reject("INVALID_MODE");
            if(mod === "ap" && new RegExp(/mania|taiko|catch/).test(mod)) return reject("INVALID_MODE");
            let modMode = {
                vn_std: 0,
                vn_taiko: 1,
                vn_catch: 2,
                vn_mania: 3,
            
                rx_std: 4,
                rx_taiko: 5,
                rx_catch: 6,
            
                ap_std: 7
            }

            let query = `SELECT u.id, u.name, u.country, u.priv, u.creation_time, s.playtime playtime, s.plays playcount, s.pp pp, s.acc accuracy, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.priv & 1) AS global_rank, (SELECT COUNT(*)+1 FROM stats ss JOIN users uu USING(id) WHERE ss.pp > s.pp AND ss.mode = s.mode AND uu.country = u.country AND uu.priv >= 1) AS country_rank FROM stats s JOIN users u ON s.id = u.id WHERE s.mode = ? AND safe_name = ? AND u.priv >= 3 ORDER BY global_rank;`;
            let parameters = [modMode[`${mod}_${mode}`], name];
            SutekinaClient.modules["logging"].trace(query, {query, parameters});
            SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (error, result) => {
                if(error) return reject(error);
                if(!result || !result[0]) return reject("NOT_FOUND");
                return resolve(result[0]);
            });
        });
    }
    
    /**
     * @returns {Date} the creation date.
     */
    get creationDate () {
        return new Date(this.creation_time * 1000);
    }

    /**
     * @returns {String} date string of your playtime.
     */
    get playtimeAgo () {
        return SutekinaClient.modules["time"].ago.short(this.playtime);
    }
}

// leaderboard query SELECT u.id user_id, u.name username, u.country, tscore_${mod}_${mode} tscore, rscore_vn_std rscore, pp_vn_std pp, plays_vn_std plays, playtime_vn_std playtime, acc_vn_std acc, max_combo_vn_std max_combo FROM stats JOIN users u ON stats.id = u.id WHERE pp_vn_std > 0 AND u.priv >= 3 ORDER BY pp_vn_std DESC LIMIT 50;