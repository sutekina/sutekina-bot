const pkg = require("../../package.json");

/**
 * @param {SutekinaClient} Client - SutekinaClient class.
 */
module.exports = (Client) => {
    const modules = {};

    Object.keys(pkg.dependencies).map(dependency => {
        modules[dependency] = require(dependency);
    });
    
    modules["logging"] = require("../util/logging")(modules, Client.config);
    modules["handler"] = require("../util/handler");
    return modules;
}