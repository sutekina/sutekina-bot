const pkg = require("../../package.json");
const utilHandler = require("../util/index");

/**
 * @param {SutekinaClient} client - SutekinaClient class.
 */
module.exports = (client) => {
    const modules = {};

    Object.keys(pkg.dependencies).map(dependency => {
        modules[dependency] = require(dependency);
    });
    
    utilHandler().map(utilModule => modules[utilModule.name] = utilModule.require)

    modules["logging"] = modules["logging"](modules["winston"], client.config);
    return modules;
}