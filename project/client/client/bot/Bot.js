Client = require("./../Client");
utils = require("./../../../lib/server/server_utils");


class Bot{
    constructor(username, isSendingProposals){
        let client = new Client(username);

        this.client = client;
        this.isSendingProposals = isSendingProposals;

        this.client.onUserList = function(users){
            if(isSendingProposals){
                for(var i = 0; i<users.length; i++) {
                    if(users[i].id !== client.me.id){
                        if(users[i].status !== utils.USER_STATUS_GAME) {
                            client.sendProposal(users[i]);
                        }
                    }
                }
            }
        }

        if(!isSendingProposals) {
            this.client.onProposalCame = function (proposal, index) {
                client.acceptProposal(proposal, index);
            }
        }
    }
}

module.exports = Bot;