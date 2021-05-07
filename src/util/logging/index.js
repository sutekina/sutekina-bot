const path = require('path');
const levels = require('./levels.json');
const colors = require('./colors.json');

/**
 * @param {Modules} modules - Winston is required.
 * @param {Config} config - SutekinaConfig, debug fields are required.
 */
module.exports = (modules, config) => {
    modules["winston"].addColors(colors);

    return modules["winston"].createLogger({
        levels: levels,
        transports: [
            new modules["winston"].transports.Console({
                level: config.debug.terminal_level,
                format: modules["winston"].format.combine(
                    modules["winston"].format.colorize(),
                    modules["winston"].format.errors({stack:true}),
                    modules["winston"].format.timestamp({format: "MM-DD-YYYY HH:mm:ss.SSS UTC"}),
                    modules["winston"].format.printf(info => {
                        return `[${info.timestamp}] ${info.level}: ${info.stack || info.message}`
                    }),
                )
            }),
            new modules["winston"].transports.File({
                level: config.debug.file_level,
                json: true,
                filename: path.join(__dirname, "../../..", config.debug.file_dir, `${new Date().toISOString()}.log`),
                format: modules["winston"].format.combine(
                    modules["winston"].format.errors({stack:true}),
                    modules["winston"].format.timestamp(),
                    modules["winston"].format.json({space: 2})
                )
            })
        ]
    });
};