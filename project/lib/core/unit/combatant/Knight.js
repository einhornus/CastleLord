Unit = require("../Unit");
utils = require("../../utils");
generators = require("../../generators");
RelocationMove = require("../../move/RelocationMove");
IdleMove = require("../../move/IdleMove");
AttackMove = require("../../move/AttackMove");


class Knight extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Knight";
        this.isMounted = true;
    }

    isBuilding() {
        return false;
    }

    getWeapon(){
        return utils.GAME_PARAMS.WEAPON.SWORD;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.KNIGHT;
    }

    getArmour(){
        if(this.isMounted) {
            return utils.GAME_PARAMS.ARMOUR.HORSE;
        }
        else{
            return utils.GAME_PARAMS.ARMOUR.PLATE;
        }
    }

    generateMoves(game){
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let res = utils.concatMoves(rel, attack);

        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new ChangeStateMove(this));
        res.push(new IdleMove());
        return res;
    }
}

module.exports = Knight;