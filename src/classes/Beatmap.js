const SutekinaClient = require("../index");
const https = require("https");

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
     * @returns {Beatmap} Beatmap object.
     */
    constructor(beatmap) {
        beatmap = SutekinaClient.modules["validation"].interface(beatmap, BeatmapInterface);
        Object.assign(this, beatmap);
    };

    /**
     * @returns ojsama parsed map.
     */
    get map_file () {
        return new Promise((resolve, reject) => {
            if(this._map_file) {
                resolve(this._map_file)
            } else {
                let options = {
                    protocol: "https:",
                    host: "osu.ppy.sh",
                    path: `/osu/${this.beatmap_id}`,
                    port: 443
                };
                SutekinaClient.modules["logging"].trace(`preparing request for ${options.host}`,  options);
                https.get(options, (res) => {                        
                    SutekinaClient.modules["logging"].trace(`request to ${options.host}`, {...options});
                    SutekinaClient.modules["logging"].debug(`request to ${options.host}${options.path} // ${res.statusCode} ${res.statusMessage}`)
                    let data = '';
                    res.on('data', chunk => {
                        SutekinaClient.modules["logging"].trace(`received chunk ${options.host}`, {...options})
                        data += chunk;
                    });
        
                    res.on('close', () => {
                        SutekinaClient.modules["logging"].trace(`request to ${options.host} closed.`, {data});
                        const parser = new SutekinaClient.modules["ojsama"].parser().feed(data.toString());
                        this._map_file = parser.map;
                        resolve(this._map_file)
                    });
                }).on("error", err => reject(err));
            }
        });
    };

    /**
     * @param {Score} score - Accepts Score object.
     * @returns ojsama star rating, if you want the star rating as number access .total
     */
    async getStarRating (score) {
        return new SutekinaClient.modules["ojsama"].diff().calc({map: await this.map_file, mods: score.mods});
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
                if(beatmap.total_length == 0 || beatmap.max_combo == 0) {
                    let options = {
                        protocol: "https:",
                        host: "osu.ppy.sh",
                        path: `/api/get_beatmaps?k=${SutekinaClient.config.authentication.osu}&h=${md5}`,
                        port: 443
                    };
                    SutekinaClient.modules["logging"].trace(`preparing request for ${options.host}`,  options);
                    https.get(options, (res) => {                        
                        SutekinaClient.modules["logging"].trace(`request to ${options.host}`, {...options});
                        SutekinaClient.modules["logging"].debug(`request to ${options.host}${options.path.replace(SutekinaClient.config.authentication.osu, "OSU-API-TOKEN")} // ${res.statusCode} ${res.statusMessage}`)
                        let data = '';
                        res.on('data', chunk => {
                            SutekinaClient.modules["logging"].trace(`received chunk ${options.host}`, {...options})
                            data += chunk;
                        });
                        res.on('close', () => {
                            SutekinaClient.modules["logging"].trace(`request to ${options.host} closed.`, {data});
                            data = JSON.parse(data);
                            beatmap.total_length = parseInt(data[0].total_length);
                            beatmap.max_combo = parseInt(data[0].max_combo);

                            query = `UPDATE maps SET total_length = ?, max_combo = ? WHERE md5 = ?;`;
                            parameters = [beatmap.total_length, beatmap.max_combo, md5];
                            SutekinaClient.modules["logging"].trace(query, {query, parameters});
                            SutekinaClient.modules["mysql2"].connection.execute(query, parameters, (err) => {
                                if(err) reject(err);
                                if(!err) resolve(beatmap);
                            });
                        });
                    }).on("error", err => reject(err));
                } else resolve(beatmap);
            }
        });
    });
}

module.exports = Beatmap;