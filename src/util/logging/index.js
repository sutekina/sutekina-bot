const path = require('path');
const levels = require('./levels.json');
const colors = require('./colors.json');

module.exports = (winston, config) => {
    winston.addColors(colors);

    return winston.createLogger({
        levels: levels,
        transports: [
            new winston.transports.Console({
                level: config.debug.terminal_level,
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.errors({stack:true}),
                    winston.format.timestamp({format: "MM-DD-YYYY HH:mm:ss.SSS UTC"}),
                    winston.format.printf(info => {
                        return `[${info.timestamp}] ${info.level}: ${info.stack || info.message}`
                    }),
                )
            }),
            new winston.transports.File({
                level: config.debug.file_level,
                json: true,
                filename: path.join(__dirname, "../../..", config.debug.file_dir, `${new Date().toISOString()}.log`),
                format: winston.format.combine(
                    winston.format.errors({stack:true}),
                    winston.format.timestamp(),
                    winston.format.json({space: 2})
                )
            })
        ]
    });
};