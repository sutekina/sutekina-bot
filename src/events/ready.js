module.exports = {
    name: "ready",
    once: true,
    execute: (client) => client.modules.logging.info(`${client.config.application.name}@${client.config.application.version} is running, the prefix is ${client.config.application.prefix}.`)
}