const SutekinaClient = require("../index");
const fs = require("fs");
const path = require("path");
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
                try {
                    let filePath = path.join(__dirname, "../../", SutekinaClient.config.gulag.dir, `.data/osu/${this.beatmap_id}.osu`);
                    
                    if(fs.existsSync(filePath)) {
                        fs.readFile(filePath, (err, file) => {
                            if(err) reject(err);
                            else {
                                const parser = new SutekinaClient.modules["ojsama"].parser().feed(file.toString());
                                this._file = parser.map;
                                resolve(this._file)
                            }
                        });
                    } else {
                        SutekinaClient.modules["request"].GET(`https://osu.ppy.sh:443/osu/${this.beatmap_id}`).then(data => {
                            const parser = new SutekinaClient.modules["ojsama"].parser().feed(data.toString());
                            this._file = parser.map;
                            resolve(this._file)
                        }).catch(err => reject(err));
                    }
                } catch(err) {
                    reject(err);
                }
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
        } else {
            this.bpm = this.base_bpm;
        }

        return this.bpm;
    };
}

module.exports = Beatmap;

// beatmap.status
// UNKNOWN = -2
// NOT_SUBMITTED = -1
// PENDING = 0         # No leaderboard
// NEED_UPDATE = 1
// RANKED = 2          # With leaderboard.
// APPROVED = 3        # With leaderboard. Different icon. No alert.
// QUALIFIED = 4       # With leaderboard. Different icon. Alert.
// LOVED = 5           # With leaderboard. Different icon. Alert.