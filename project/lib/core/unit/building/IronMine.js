Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");


class IronMine extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Mine";

        this.size = 1;
        this.height = [[1.0]];

        this.mainHeight = 1;
    }


    updateIncome(game){
        this.income = utils.GAME_PARAMS.INCOME.MINE;
    }


    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.WOOD_BUILDING;
    }

    generateMoves(game){
        let res = new IncomeMove(0, utils.GAME_PARAMS.INCOME.MINE, 0, 0, this.color);
        return [res];
    }
}

module.exports = IronMine;