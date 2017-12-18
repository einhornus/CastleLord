utils = require("./../../../lib/server/server_utils");
MessageHandler = require("./MessageHandler");
User = require("../User");

class ConnectionMessageHandler extends MessageHandler {
    constructor() {
        super();
    }

    handleCore(message, server, client) {
        let username = message.username;

        if (!server.checkUsernameAvailable(username)) {
            throw new utils.Exception(utils.REASON_LOGIN_UNAVAILABLE);
        }

        let id = server.generateId(utils.LINE_USER_ID);
        let user = new User(username, id, client);
        server.connectUser(user);

        /*
        let ucmes = {type: utils.MESSAGE_TYPE_USER_CONNECTED_SERVER, user: user.encrypt()};
        let userConnectedMessage = ucmes;
        server.broadcastMessage(userConnectedMessage);
        */

        let connectionSuccessfulMessage = {type: utils.MESSAGE_TYPE_SUCCESS_SERVER, index: message.index, user:user.encrypt()};
        server.sendMessage(connectionSuccessfulMessage, user);

        let allEncryptedUsers = server.getAllEncryptedUsers();
        let allUsersMessage = {type: utils.MESSAGE_TYPE_USER_LIST_SERVER, users: allEncryptedUsers};
        server.broadcastMessage(allUsersMessage);
    }
}

module.exports = ConnectionMessageHandler;