module.exports = {
    name: "minju",
    category: "nicole",
    description: "Send a random minju gif.",
    usage: "maybe add later",
    parameters: ["limit"],
    execute: async (client, message) => {
        let limit = message.params.limit ? parseInt(message.params.limit) : 40;
        let random_position = Math.floor(Math.random() * limit);

        client.modules.request.GET(`https://g.tenor.com:443/v1/search?key=${client.config.authentication.tenor}&q=kim-minju&ar_range=standard&limit=1&pos=${random_position}`).then(data => {
            message.channel.send(`random minju for you :] ${JSON.parse(data).results[0].url}`);
        }).catch(err => {
            message.channel.send("There was an issue when trying to get cool minju, sorry ig.");
            return client.emit("error", err);
        });
    }
}