class ConnectionMessageHandler{
    constructor(){

    }

    static handle(message, server){
        let username = message.username;
        let index = utils.genRandomString(utils.RANDOM_STRING_LENGTH);
        if(server.checkUsernameAvailable(username)){
            let id = server.generateId();
            let user = new User(username, id);
            server.connectUser(user);
            let answerMessage = {type:"Answer", index:index, }
        }
        else{

        }
    }
}