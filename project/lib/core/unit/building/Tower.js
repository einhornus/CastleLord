Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");
IdleMove = require("../../move/IdleMove");


class Tower extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Tower";
        this.size = 1;

        this.height = [[utils.GAME_PARAMS.TOWER_HEIGHT]];
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

module.exports = Tower;