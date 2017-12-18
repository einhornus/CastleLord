Unit = require("./Unit");
utils = require("../utils");
IncomeMove = require("../move/IncomeMove");


class GoldMine extends Unit{
    constructor(position, color){
        super(position, color);
    }

    generateMoves(game){
        let res = new IncomeMove(utils.GOLD_MINE_PLUS, 0, this.color);
        return [res];
    }

    static getPriceGold(){
        return 3;
    }

    static getPriceStone(){
        return 5;
    }
}

module.exports = GoldMine;