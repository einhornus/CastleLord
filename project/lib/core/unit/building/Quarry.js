Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");


class Quarry extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Mine";

        this.size = 1;

        this.height = [[1.1]];
    }

    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.WOOD_BUILDING;
    }

    generateMoves(game){
        let res = new IncomeMove(0, 0, utils.GAME_PARAMS.INCOME.QUARRY, 0, this.color);
        return [res];
    }
}

module.exports = Quarry;