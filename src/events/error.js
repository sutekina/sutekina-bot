module.exports = {
    name: "error",
    once: false,
    execute: (error, client) => {
        client.modules["logging"].error(error.message, error);
    }
}