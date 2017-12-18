Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");
IdleMove = require("../../move/IdleMove");


class Gate extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Gate";

        this.size = 1;

        this.height = [
            [2.0],
        ]
    }

    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.STONE_BUILDING;
    }

    generateMoves(game){
        let res = new IdleMove();
        return [res];
    }
}

module.exports = Gate;