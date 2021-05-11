module.exports = {
    name: "warn",
    once: false,
    execute: (info, client) => {
        client.modules["logging"].warn(info);
    }
}