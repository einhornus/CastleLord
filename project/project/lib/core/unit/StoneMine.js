Unit = require("./Unit");
utils = require("../utils");
IncomeMove = require("../move/IncomeMove");


class GoldMine extends Unit{
    constructor(position, color){
        super(position, color);
    }

    generateMoves(game){
        return [new IncomeMove(0, utils.STONE_MINE_PLUS, this.color)];
    }

    static getPriceGold(){
        return 3;
    }

    static getPriceStone(){
        return 5;
    }
}

module.exports = GoldMine;