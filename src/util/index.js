const fs = require("fs");
const path = require("path")
module.exports = () => {
    const utilModules = [] 
    const utilFolders = fs.readdirSync(__dirname).filter(dir => !dir.endsWith(".js"));
    
    utilFolders.map(utilModule => utilModules.push({
        name: utilModule,
        require: require(path.join(__dirname, utilModule))
    }));
    
    return utilModules;
}