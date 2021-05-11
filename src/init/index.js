const Discord = require("discord.js");
const path = require("path");
const initModules = require("./initModules");
const connectDB = require("./connectDB");

class SutekinaClient extends Discord.Client {
    /**
     * @param {ClientOptions} options - the options for the DiscordClient
     */
    constructor(options = {}) {
        super(options);
        
        connectDB(this);
        this.modules["handler"].eventsHandler(this);
        [this.commands, this.commandCategories] = this.modules["handler"].commandsCollection(this.modules);
    }

    get config() {
        let config_path = path.join(__dirname, "../../config.json");
        try {
            return require(config_path);
        } catch(err) {
            throw new Error(`Couldn't require ${config_path}, either create from sample or check for permissions.`)
        }
    }
    
    get modules() {
        if(!this._modules) {        
            try {
                this._modules = initModules(this);
            } catch(err) {
                throw err;
            }
        }
        return this._modules
    }

    close() {
        this.destroy();
        process.exit();
    }
};

module.exports = SutekinaClient;