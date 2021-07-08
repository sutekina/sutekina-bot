const https = require("https");
let SutekinaClient;
module.exports = (url) => {
    SutekinaClient = (SutekinaClient) ?  SutekinaClient : require("../../index");

    return new Promise((resolve, reject) => {
        if(!url) reject(new Error("No url was provided."));
        
        let options = {
            protocol: url.split(/\/\//)[0],
            host: url.split(/\/\//)[1].split(/:/)[0],
            path: "/" + url.split(/\/\//)[1].split(/\//).slice(1).join("/"),
            port: url.split(/:/)[2].split(/\//)[0] || undefined
        };

        SutekinaClient.modules["logging"].trace(`preparing request for ${options.host}`,  options);
        https.get(options, (res) => {                        
            SutekinaClient.modules["logging"].trace(`request to ${options.host}`, {...options});
            SutekinaClient.modules["logging"].debug(`request to ${options.host}${options.path} // ${res.statusCode} ${res.statusMessage}`)
            let data = '';
            res.on('data', chunk => {
                SutekinaClient.modules["logging"].trace(`received chunk ${options.host}`, {...options})
                data += chunk;
            });
    
            res.on('close', () => {
                SutekinaClient.modules["logging"].trace(`request to ${options.host} closed.`, {data});
                resolve(data);
            });
        }).on("error", err => reject(err));
    })
}