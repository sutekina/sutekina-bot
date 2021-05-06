const path = require("path");


const DiscordClient = require("discord.js").Client;
const initModules = require("./initModules");

new DiscordClient()

class SutekinaClient extends DiscordClient {
    /**
     * @param {ClientOptions} options - the options for the DiscordClient
     */
    constructor(options = {}) {
        super(options)
        this.modules = initModules(this);
    }

    get config() {
        let config_path = path.join(__dirname, "../../config.json");
        try {
            return require(config_path);
        } catch(err) {
            throw new Error(`Couldn't require ${config_path}, either create from sample or check for permissions.`)
        }
    }
};

module.exports = SutekinaClient;