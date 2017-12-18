Move = require("./Move");
utils = require("../utils");


class IdleMove extends Move{
    constructor(){
        super();
        this.type = "Idle";
    }

    hash(){
        return 78546754;
    }

    assign(unit, game){
        return [];
    }
}

module.exports = IdleMove;