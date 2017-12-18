Unit = require("../Unit");
utils = require("../../utils");
generators = require("../../generators");
RelocationMove = require("../../move/RelocationMove");
IdleMove = require("../../move/IdleMove");
AttackMove = require("../../move/AttackMove");


class Horseman extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Horseman";


    }

    isBuilding() {
        return false;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.HORSEMAN;
    }

    getWeapon(){
        return utils.GAME_PARAMS.WEAPON.SWORD;
    }

    getArmour(){
        return utils.GAME_PARAMS.ARMOUR.HORSE;
    }

    generateMoves(game){
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let res = utils.concatMoves(rel, attack);

        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new IdleMove());
        return res;
    }
}

module.exports = Horseman;