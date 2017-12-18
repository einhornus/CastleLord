utils = require("./../../../lib/server/server_utils");
MessageHandler = require("./MessageHandler");
User = require("../User");

class ProposalCameMessageHandler extends MessageHandler {
    constructor() {
        super();
    }

    handleCore(message, server, client) {
        let alice = server.findUser(message.proposal.alice);
        let bob = server.findUser(message.proposal.bob);

        if(alice.status === utils.USER_STATUS_GAME){
            throw new utils.Exception(utils.REASON_PROPOSAL_WHILE_USER_IN_GAME);
        }

        if(alice.status === utils.USER_STATUS_GAME){
            throw new utils.Exception(utils.REASON_PROPOSAL_WHILE_USER_IN_GAME);
        }

        let proposal = {body:message.proposal, messageIndex:message.index};
        server.proposals.push(proposal);

        let newProposalMessage = {type: utils.MESSAGE_TYPE_PROPOSAL_CAME_SERVER, proposal: proposal};
        server.sendMessage(newProposalMessage, bob);
    }
}

module.exports = ProposalCameMessageHandler;