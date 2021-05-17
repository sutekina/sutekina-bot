module.exports = {
    name: "ping",
    category: "info",
    description: "Get the latency of the application.",
    usage: "maybe add later",
    parameters: [],
    execute: (client, message) => {
        message.channel.send({embed: {
            "color": parseInt(client.config.application.color, 16),
            "description": `My Ping is **${Math.round(client.ws.ping)}ms**`
        }});
    }
}