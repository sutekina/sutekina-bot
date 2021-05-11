module.exports = (originalObject, interfaceObject) => {
	Object.keys(interfaceObject).map(key => {
        if(!originalObject.hasOwnProperty(key)) {
            throw new Error("Object doesn't have the key " + key);
        }
    });

    Object.keys(originalObject).map(key => {
        if(!interfaceObject.hasOwnProperty(key)) {
            delete originalObject[key];
        }
    });
    
	return originalObject;
}