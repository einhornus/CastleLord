Move = require("./Move");

class IdleMove extends Move{
    constructor(){
        super();
    }

    hash(){
        return 78546754;
    }
}

module.exports = IdleMove;