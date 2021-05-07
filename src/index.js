let SutekinaClient = require("./init"); 

SutekinaClient = new SutekinaClient({
    messageCacheLifetime: 3600,
    messageSweepInterval: 60,
    messageEditHistoryMaxSize: 200,
    disableMentions: "everyone",
    presence: {
        status: "idle",
        activity: {
            type: "COMPETING",
            name: "your mom"
        }
    }
});

module.exports = SutekinaClient;

SutekinaClient.login(SutekinaClient.config.authentication.discord).catch(err => {
    SutekinaClient.modules.logging.fatal(err.message, err);
    setTimeout(() => SutekinaClient.close(), 300);
});
