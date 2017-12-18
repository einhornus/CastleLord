utils = require("./../../lib/server/server_utils");


class User{
    constructor(username, id, client){
        this.username = username;
        this.id = id;
        this.client = client;
        this.status = utils.USER_STATUS_LOBBY;
    }

    encrypt(){
        let res = {};
        res.id = this.id;
        res.username = this.username;
        res.status = this.status;
        return res;
    }
}

module.exports = User;