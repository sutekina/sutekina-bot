const SutekinaClient = require("../index");
const Beatmap = require("./Beatmap");

const ScoreInterface = {
    score_id: new Number(),
    beatmap_md5: new String(), 
    score: new Number(), 
    pp: new Number(),
    accuracy: new Number(), 
    max_combo: new Number(), 
    mods: new Number(), 
    hits_300: new Number(), 
    hits_100: new Number(), 
    hits_50: new Number(), 
    hits_miss: new Number(), 
    grade: new String(), 
    status: new Number(), 
    mode: new Number(), 
    play_time: new Date(), 
    time_elapsed: new Number(), 
    client_flags: new Number(), 
    user_id: new Number(), 
    perfect: new Number()
}

class Score {
    /**
     * @param {ScoreInterface} score - Accepts Score object like the one you get back from getScore or you can create one based on the ScoreInterface.
     * @returns {Score} Score object. 
     */
    constructor(score) {
        score = SutekinaClient.modules["validation"].interface(score, ScoreInterface);
        Object.assign(this, score);
    }

    /**
     * @returns {Array} an array of all the mods in a bitwise manor.
     */
    get mod_list () {
        if(!this._mod_list) {
            // i < 50 is just for security in case someone inputs an invalid number which should never happen but if that happens then I wouldn't want an infinite loop.
            let i = 1; let arr = []; let mods = this.mods;
            while(mods != 0 && i < 50) {
                let mod = 1 << 31 - Math.clz32(mods);
                arr.push(mod);
                mods -= mod; i++;
            }
            this._mod_list = arr;
        }
        return this._mod_list;
    }
    
    get hits_list () {
        if(!this._hits) {
            this._hits = [];
            
            this._hits.push(this.hits_300, this.hits_100, this.hits_50, this.hits_miss)
        } 
        
        return this._hits
    }

    get beatmap() {
        return new Promise((resolve, reject) => {
            if(this._beatmap) resolve(this._beatmap);

            let query = `SELECT server, id beatmap_id, set_id beatmapset_id, status, md5 beatmap_md5, artist, title, version difficulty, creator, last_update, total_length, max_combo, mode, bpm base_bpm FROM osu.maps WHERE md5 = ?;`;
            let parameters = [this.beatmap_md5];
            SutekinaClient.modules["logging"].trace(query, {query, parameters})
            SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (error, result) => {
                if(error) reject(error);
                if(!result || !result[0]) reject("NOT_FOUND");
                if(result[0]) {
                    this._beatmap = new Beatmap(result[0]);
                    // all of this is just because some maps will have a max_combo / total_length of 0 caused by old code, in theory it's unneccesary if you are running new gulag code.
                    if(this._beatmap.total_length != 0 && this._beatmap.max_combo != 0) resolve(this._beatmap);
                    else SutekinaClient.modules["request"].GET(`https://osu.ppy.sh:443/api/get_beatmaps?k=${SutekinaClient.config.authentication.osu}&h=${this.beatmap_md5}`).then(data => {
                        data = JSON.parse(data)[0];
                        // the map isn't on the osu server, deleted? TODO maybe delete score from db?
                        if(!data) return reject("NOT_FOUND");

                        this._beatmap.total_length = parseInt(data.total_length);
                        this._beatmap.max_combo = parseInt(data.max_combo);
                        query = `UPDATE maps SET total_length = ?, max_combo = ? WHERE md5 = ?;`;
                        parameters = [this._beatmap.total_length, this._beatmap.max_combo, this.beatmap_md5];
                        SutekinaClient.modules["logging"].trace(query, {query, parameters});
                        SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (err) => {
                            if(err) return reject(err);
                            return resolve(this._beatmap);
                        });
                    }).catch(err => reject(err));
                }
            });
        });
    }

    /**
     * @param {Beatmap} beatmap - Accepts Beatmap class objects. 
     * @returns {Object} an Object with the fullcombo pp and full combo accuracy.
     */
    async getFCPP (beatmap) {
        if(beatmap.max_combo == this.max_combo) return {pp: null, accuracy: null};

        let accuracy = Score.getAccuracy({hits_300: this.hits_300, hits_100: this.hits_100, hits_50: this.hits_50 + this.hits_miss, hits_miss: 0});

        let pp = (SutekinaClient.modules["ojsama"].ppv2({
            stars: await beatmap.getStarRating(this),
            combo: beatmap.max_combo,
            nmiss: 0,
            acc_percent: accuracy
        })).total;

        return {pp, accuracy};
    }

    // this completion is inaccurate if the total_length is retrieved from bancho because bancho total_length != gulag total_length :( maybe get total_length from chimu, idk what they use.
    /**
     * @param {Beatmap} beatmap - Accepts Beatmap class objects.
     * @returns {Number} the completion as % number.
     */
    async getCompletion (beatmap) {
        // this should work but it aint so i aint gon use it LOL :)
        // let completion = (this.time_elapsed / 1000) * 100 / beatmap.total_length;
        beatmap = await beatmap.file;

        let total_objects = beatmap.nspinners + beatmap.nsliders + beatmap.ncircles;
        let hit_objects = this.hits_list.reduce((a, b) => a + b, 0);
        return hit_objects * 100 / total_objects;
    }
}

const HitsInterface = {hits_300: Number, hits_100: Number, hits_50: Number, hits_miss: Number}

/**
 * @param {HitsInterface} hits_list - Accepts an object with hits_300, hits_100, hits_50 and hits_miss. 
 * @returns {Number} the accuracy as % number.
 */
Score.getAccuracy = (hits_list) => {
    return ((hits_list.hits_300 * 300 + hits_list.hits_100 * 100 + hits_list.hits_50 * 50 + hits_list.hits_miss * 0)/((hits_list.hits_300 + hits_list.hits_100 + hits_list.hits_50 + hits_list.hits_miss) * 300) * 100);
};

module.exports = Score;

// score_id,
// beatmap_md5,
// score,
// pp,
// accuracy,
// max_combo,
// mods,
// hits_300,
// hits_100,
// hits_50,
// hits_miss,
// grade,
// status, {
//     0: failed,
//     1: submitted,
//     2: best
// }
// mode, {
//     0: std,
//     1: taiko,
//     2: ctb,
//     3: mania
// }
// play_time,
// time_elapsed, ms
// client_flags,
// user_id,
// perfect /whether its fullcombo