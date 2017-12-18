utils = require("./../../../lib/server/server_utils");
MessageHandler = require("./MessageHandler");
User = require("../User");

class ProposalAcceptedMessageHandler extends MessageHandler {
    constructor() {
        super();
    }

    handleCore(message, server, client) {
        let alice = server.findUser(message.proposal.body.alice);
        let bob = server.findUser(message.proposal.body.bob);

        let proposalToFind = message.proposal;
        let index = MessageHandler.findProposal(proposalToFind, server);

        let originalMessageIndex = message.proposal.messageIndex;

        let proposalAcceptedServerMessage = {type:utils.MESSAGE_TYPE_PROPOSAL_ACCEPTED_SERVER, index:originalMessageIndex};
        server.sendMessage(proposalAcceptedServerMessage, alice);

        alice.status = utils.USER_STATUS_GAME;
        bob.status = utils.USER_STATUS_GAME;

        server.proposals.splice(index, 1);

        MessageHandler.broadcastAllUsers(server);
    }

}

module.exports = ProposalAcceptedMessageHandler;