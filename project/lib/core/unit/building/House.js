Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");


class House extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "House";

        this.size = 3;

        this.height = [
            [3.0, 3.0, 3.0],
            [4.0, 4.0, 4.0],
            [3.0, 3.0, 3.0],
        ]

    }

    isBuilding() {
        return true;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.HOUSE;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.WOOD_BUILDING;
    }

    generateMoves(game){
        let res = new IncomeMove(utils.GAME_PARAMS.INCOME.HOUSE, 0, 0, 0, this.color);
        return [res];
    }
}

module.exports = House;