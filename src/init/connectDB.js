module.exports = (client) => {
    handleDisconnect = () => {
        client.modules["mysql2"].connection = client.modules["mysql2"].createConnection(client.config.mysql);
        // client.modules["mysql2"].connection.config.namedPlaceholders = true;
        client.modules["mysql2"].connection.connect(function(err) {
            if(err) {
                client.modules["logging"].fatal(err.message, err);
                setTimeout(handleDisconnect, 2000);
            } else {
                client.modules["logging"].debug(`Connected to ${client.config.mysql.user}@${client.config.mysql.host}:${client.config.mysql.port}`)
            }
        });
    
        client.modules["mysql2"].connection.on('error', function(err) {
            client.modules["logging"].fatal(err.message, err);
            if(err.code === "PROTOCOL_CONNECTION_LOST") return setTimeout(handleDisconnect, 2000);
            throw err;
        });
    };
    
    handleDisconnect();
}