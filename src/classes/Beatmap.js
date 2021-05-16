const SutekinaClient = require("../index");

const mods = require("../enum/mods");
const Score = require("./Score");

const BeatmapInterface = {
    server: new String(),
    beatmap_id: new Number(),
    beatmapset_id: new Number(),
    status: new Number(),
    beatmap_md5: new String(),
    artist: new String(),
    title: new String(),
    difficulty: new String(),
    creator: new String(),
    last_update: new Date(),
    total_length: new Number(),
    max_combo: new Number(),
    mode: new Number(),
    base_bpm: new Number()
}

class Beatmap {
    /**
     * @param {BeatmapInterface} beatmap - Accepts a BeatmapInterface like it is returned from Beatmap.getBeatmap().
     * @returns {BeatmapInterface} Beatmap object.
     */
    constructor(beatmap) {
        beatmap = SutekinaClient.modules["validation"].interface(beatmap, BeatmapInterface);
        Object.assign(this, beatmap);
    };

    /**
     * @returns ojsama parsed map.
     */
    get file () {
        return new Promise((resolve, reject) => {
            if(this._file) {
                resolve(this._file)
            } else {
                SutekinaClient.modules["request"].GET(`https://osu.ppy.sh:443/osu/${this.beatmap_id}`).then(data => {
                    const parser = new SutekinaClient.modules["ojsama"].parser().feed(data.toString());
                    this._file = parser.map;
                    resolve(this._file)
                }).catch(err => reject(err));
            }
        });
    };

    /**
     * @param {Score} score - Accepts Score object.
     * @returns ojsama star rating, if you want the star rating as number access .total
     */
    async getStarRating (score) {
        return new SutekinaClient.modules["ojsama"].diff().calc({map: await this.file, mods: score.mods});
    };
    
    /**
     * @param {Score} score - Accepts Score object.
     * @returns calculated bpm adjusted to the mods.
     */
    getBPM (score) {
        if(score.mod_list.includes(mods.bitwise.DoubleTime)) {
            this.bpm = this.base_bpm * 1.5;
        } else if(score.mod_list.includes(mods.bitwise.HalfTime)) {
            this.bpm = this.base_bpm * 0.75;
        }
        return this.bpm;
    };
}

/**
 * @param {String} md5 - Accepts beatmap_md5 as identifier for beatmaps. 
 * @returns {Beatmap} creates new Beatmap and resolves it in a Promise.
 */
Beatmap.getBeatmap = (md5) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT server, id beatmap_id, set_id beatmapset_id, status, md5 beatmap_md5, artist, title, version difficulty, creator, last_update, total_length, max_combo, mode, bpm base_bpm FROM osu.maps WHERE md5 = ?;`;
        let parameters = [md5];
        SutekinaClient.modules["logging"].trace(query, {query, parameters})
        SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (error, result) => {
            if(error) reject(error);
            if(!result || !result[0]) reject("NOT_FOUND");
            if(result[0]) {
                let beatmap = new Beatmap(result[0]);
                // all of this is just because some maps will have a max_combo / total_length of 0 caused by old code, in theory it's unneccesary if you are running new gulag code.
                if(beatmap.total_length == 0 || beatmap.max_combo == 0) {
                    SutekinaClient.modules["request"].GET(`https://api.chimu.moe:443/cheesegull/md5/${md5}`).then(data => {
                        data = JSON.parse(data);
                        beatmap.total_length = parseInt(data.TotalLength);
                        beatmap.max_combo = parseInt(data.MaxCombo);
                        query = `UPDATE maps SET total_length = ?, max_combo = ? WHERE md5 = ?;`;
                        parameters = [beatmap.total_length, beatmap.max_combo, md5];
                        SutekinaClient.modules["logging"].trace(query, {query, parameters});
                        SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (err) => {
                            if(err) reject(err);
                            if(!err) resolve(beatmap);
                        });
                    }).catch(err => reject(err))
                } else resolve(beatmap);
            }
        });
    });
}

module.exports = Beatmap;