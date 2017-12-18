utils = require("./../../lib/server/server_utils");

class Client {
    constructor(username) {
        var io = require('socket.io-client');
        this.socket = io.connect('http://localhost:3000', {reconnect: true});
        var moi = this;
        this.me = null;

        this.socket.on('connect', function (socket) {
            console.log('Connected!');
            let message = {};
            message.type = utils.MESSAGE_TYPE_CONNECTION_CLIENT;
            message.username = username;
            message.index = utils.genRandomString();
            moi.socket.emit("message", message);
            console.log("Emitted", message);
        });

        this.socket.on("message", function (msg) {
            moi.receiveMessage(msg);
        });
    }

    receiveMessage(message){
        if(this.me !== null) {
            console.log("Received by", this.me.username, message);
        }
        else {
            console.log("Received ", message);
        }

        if(message.type === utils.MESSAGE_TYPE_PROPOSAL_ACCEPTED_SERVER){
            this.onProposalAccepted(message.proposal);
        }

        if(message.type === utils.MESSAGE_TYPE_PROPOSAL_CAME_SERVER){
            this.onProposalCame(message.proposal, message.index);
        }

        if(message.type === utils.MESSAGE_TYPE_SUCCESS_SERVER){
            this.me = message.user;
        }

        if(message.type === utils.MESSAGE_TYPE_USER_LIST_SERVER){
            this.users = message.users;
            this.onUserList(message.users);
        }
    }

    sendProposal(bob){
        if(this.me === null){
            throw new utils.Exception("You did not connected to the server");
        }

        let proposal = {alice:this.me, bob:bob, proposalIndex : utils.genRandomString()};
        let proposalMessage = {type:utils.MESSAGE_TYPE_PROPOSAL_CAME_CLIENT, proposal:proposal, index:utils.genRandomString()};

        this.sendMessage(proposalMessage);
    }

    acceptProposal(proposal, index){
        let acceptMessage = {type:utils.MESSAGE_TYPE_PROPOSAL_ACCEPTED_CLIENT, proposal:proposal, index:index};
        this.sendMessage(acceptMessage);
    }

    onUserList(users){
        console.log(users);
    }

    onUserConnected(){
        console.log("New user connected");
    }

    onProposalAccepted(proposal){
        console.log("Proposal accepted", proposal);
    }

    onProposalCame(proposal, index){
        console.log("New proposal", proposal);
    }

    sendMessage(message){
        this.socket.emit("message", message);
    }
}

module.exports = Client