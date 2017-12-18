Unit = require("../Unit");
BuildingMove = require("../building/Barrack");
RelocationMove = require("../../move/RelocationMove");
Map = require("../../map/Map");


Barrack = require("../building/Barrack");
Church = require("../building/Church");
Farm = require("../building/Farm");
GoldMine = require("../building/House");
IronMine = require("../building/IronMine");
Quarry = require("../building/Quarry");


utils = require("../../utils");
IdleMove = require("../../move/IdleMove");
generators = require("../../generators");


class Priest extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Priest";
    }

    isBuilding() {
        return false;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.PRIEST;
    }

    generateMoves(game){
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let heal = this.generateHealingMoves(game);
        let res = utils.concatMoves(rel, attack);
        res = utils.concatMoves(res, heal);

        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new IdleMove());
        return res;
    }

    getWeapon() {
        return utils.GAME_PARAMS.WEAPON.HAMMER;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.NOTHING;
    }
}

module.exports = Priest;