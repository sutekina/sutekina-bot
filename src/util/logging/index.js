const path = require('path');
const levels = require('./levels.json');
const colors = require('./colors.json');

/**
 * @param {SutekinaClient} Client - SutekinaClient class.
 */
module.exports = (Client) => {
    Client.modules["winston"].addColors(colors);

    return Client.modules["winston"].createLogger({
        levels: levels,
        transports: [
            new Client.modules["winston"].transports.Console({
                level: Client.config.debug.terminal_level,
                format: Client.modules["winston"].format.combine(
                    Client.modules["winston"].format.colorize(),
                    Client.modules["winston"].format.errors({stack:true}),
                    Client.modules["winston"].format.timestamp({format: "MM-DD-YYYY HH:mm:ss.SSS UTC"}),
                    Client.modules["winston"].format.printf(info => {
                        return `[${info.timestamp}] ${info.level}${(info.status) ? ` ${info.status}` : ''}: ${info.stack || info.message}`
                    }),
                )
            }),
            new Client.modules["winston"].transports.File({
                level: Client.config.debug.file_level,
                json: true,
                filename: path.join(__dirname, "../../..", Client.config.debug.file_dir, `${new Date().toISOString()}.log`),
                format: Client.modules["winston"].format.combine(
                    Client.modules["winston"].format.errors({stack:true}),
                    Client.modules["winston"].format.timestamp(),
                    Client.modules["winston"].format.json({space: 2})
                )
            })
        ]
    });
};