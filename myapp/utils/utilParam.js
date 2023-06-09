exports.getParam = (params, property, defaultValue) => {
    if (params.hasOwnProperty(property) && params[property] !== undefined) {
        return params[property];
    } else {
        return defaultValue;
    }
}