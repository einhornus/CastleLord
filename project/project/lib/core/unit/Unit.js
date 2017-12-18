utils = require("../utils");



class Unit{
    constructor(position, color){
        this.position = position;
        this.color = color;
    }

    getStoneInTreasury(game){
        if(this.color === utils.WHITE){
            return game.whiteTreasury.stone;
        }

        if(this.color === utils.BLACK){
            return game.blackTreasury.stone;
        }
        return 0;
    }

    getGoldInTreasury(game){
        if(this.color === utils.WHITE){
            return game.whiteTreasury.gold;
        }

        if(this.color === utils.BLACK){
            return game.blackTreasury.gold;
        }
        return 0;
    }

    generateMoves(game){
        throw utils.Exception("Abstract method");
    }
}

module.exports = Unit;