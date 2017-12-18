utils = require("./../../lib/server/server_utils");
User = require("./User");
MessageHandler = require("./message/MessageHandler");
ConnectionMessageHandler = require("./message/ConnectionMessageHandler");
ProposalCameMessageHandler = require("./message/ProposalCameMessageHandler");
ProposalAcceptedMessageHandler = require("./message/ProposalAcceptedMessageHandler");


class Client{
    constructor(socket){
        this.socket = socket;
    }
}

class Server{
    constructor(app){
        this.users = [];
        this.ids = new Map();
        this.proposals = [];

        var port = 3000;
        var server = require('http').Server(app);

        console.log("Server started");

        server.listen(port);

        var io = require('socket.io')(server);
        var moi = this;

        io.on('connection', function (socket) {
            socket.on('message', function (msg) {
                let client = new Client(socket);
                moi.receiveMessage(msg, client);
            });
        });
    }

    checkUsernameAvailable(username){
        for(var i = 0; i<this.users.length; i++){
            if(this.users[i].username === username){
                return false;
            }
        }
        return true;
    }

    connectUser(user){
        this.users.push(user);
    }

    generateId(line){
        if(this.ids.has(line)){
            let old = this.ids.get(line);
            this.ids.set(line, old+1);
            return old;
        }
        else{
            this.ids.set(line, 2);
            return 1;
        }
    }


    receiveMessage(message, client){
        console.log("Received: ", message);

        let type = message.type;

        let handled = false;

        if(type === utils.MESSAGE_TYPE_CONNECTION_CLIENT){
            new ConnectionMessageHandler().handle(message, this, client);
            handled = true;
        }

        if(type === utils.MESSAGE_TYPE_PROPOSAL_CAME_CLIENT){
            new ProposalCameMessageHandler().handle(message, this, client);
            handled = true;
        }

        if(type === utils.MESSAGE_TYPE_PROPOSAL_ACCEPTED_CLIENT){
            new ProposalAcceptedMessageHandler().handle(message, this, client);
            handled = true;
        }

        if(!handled){
            throw new utils.Exception("Message not handled");
        }
    }

    sendMessage(message, user){
        let client = user.client;
        let socket = client.socket;
        socket.emit("message", message);
    }

    broadcastMessage(message){
        for(var i = 0; i<this.users.length; i++){
            this.sendMessage(message, this.users[i]);
        }
    }

    getAllEncryptedUsers(){
        let res = [];
        for(var i = 0; i<this.users.length; i++){
            res.push(this.users[i].encrypt());
        }
        return res;
    }

    findUser(user){
        for(var i = 0; i<this.users.length; i++){
            if(this.users[i].id === user.id){
                return this.users[i];
            }
        }
        throw new utils.Exception(utils.REASON_USER_NOT_FOUND);
    }
}

module.exports = Server;