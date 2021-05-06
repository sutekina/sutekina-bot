let SutekinaClient = require("./init"); 

SutekinaClient = new SutekinaClient({
    messageCacheLifetime: 3600,
    messageSweepInterval: 60,
    messageEditHistoryMaxSize: 200,
    presence: {
        status: "idle",
        activity: {
            type: "COMPETING",
            name: "your mom"
        }
    }
});

const config = SutekinaClient.config;

SutekinaClient.login(config.authentication.discord).then(() => console.log(`${config.application.name}@${config.application.version} is running, the prefix is ${config.application.prefix}.`)).catch(err => console.log(err))

