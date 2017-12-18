Move = require("./Move");
FootMove = require("./FootMove")
utils = require("../utils");


class SiegeMove extends Move{
    constructor(unit, castleThing){
        super();
        this.type = "Siege";
    }

    assign(unit, game) {
        if(castleThing instanceof Tower){

        }

        if(castleThing instanceof Gate || castleThing instanceof Wall){

        }
        return res;
    }
}

module.exports = AttackMove;