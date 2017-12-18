utils = require("./../../../lib/server/server_utils");


class MessageHandler {
    constructor() {

    }

    static sendFailureMessage(server, message, client) {
        let fakeUser = new User("anon", -1, client);
        server.sendMessage(message, fakeUser);
    }

    static broadcastAllUsers(server){
        let allEncryptedUsers = server.getAllEncryptedUsers();
        let allUsersMessage = {type: utils.MESSAGE_TYPE_USER_LIST_SERVER, users: allEncryptedUsers};
        server.broadcastMessage(allUsersMessage);
    }

    static areProposalsEqual(a, b) {
        if (a.body.alice.id !== b.body.alice.id) {
            return false;
        }

        if (a.body.bob.id !== b.body.bob.id) {
            return false;
        }

        if (a.body.proposalIndex !== b.body.proposalIndex) {
            return false;
        }

        if (a.messageIndex !== b.messageIndex) {
            return false;
        }
        return true;
    }

    static findProposal(proposal, server) {
        for (var i = 0; i < server.proposals.length; i++) {
            let example = server.proposals[i];
            if (MessageHandler.areProposalsEqual(example, proposal)) {
                return i;
            }
        }
        throw new utils.Exception("Proposal not found");
    }

    handle(message, server, client) {
        try {
            this.handleCore(message, server, client);
        }
        catch (err) {
            console.log("Error", err.message);
            let failureMessage = {type: utils.MESSAGE_TYPE_FAILURE_SERVER, reason: err.message, index: message.index};
            MessageHandler.sendFailureMessage(server, failureMessage, client);
        }
    }

    handleCore(message, server, client) {
        throw new utils.Exception("Abstract method");
    }
}

module.exports = MessageHandler;