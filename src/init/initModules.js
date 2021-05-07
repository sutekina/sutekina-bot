const pkg = require("../../package.json");

/**
 * @param {SutekinaClient} client - SutekinaClient class.
 */
module.exports = (client) => {
    const modules = {};

    Object.keys(pkg.dependencies).map(dependency => {
        modules[dependency] = require(dependency);
    });
    
    modules["logging"] = require("../util/logging")(modules, client.config);
    modules["handler"] = require("../util/handler");
    modules["time"] = require("../util/time");
    return modules;
}