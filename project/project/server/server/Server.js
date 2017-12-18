class Server{
    constructor(){
        this.users = [];
        this.id = 1;
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

    generateId(){
        let res = this.id;
        this.id++;
        return res;
    }

    onMessage(message){
        let type = message.type;

        if(type === "Connection"){
            let answer = ConnectionMessageHandler.handle(message, this);

        }
    }

}