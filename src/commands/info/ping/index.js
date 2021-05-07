module.exports = {
    name: "ping",
    category: "info",
    description: "Get the latency of the application.",
    usage: "maybe add later",
    execute: (client, message, args) => {
        message.channel.send({embed: {
            "color": parseInt(client.config.application.color, 16),
            "description": `My Ping is **${Math.round(client.ws.ping)}ms**`
        }});
    }
}