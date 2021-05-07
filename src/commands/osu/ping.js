module.exports = {
    name: "ping",
    description: "Get the latency of the application.",
    execute: (client, message, args) => {
        message.channel.send({embed: {
            "color": 7824867,
            "description": `My Ping is **${Math.round(client.ws.ping)}ms**`
        }});
    }
}