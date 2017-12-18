Unit = require("../Unit");
utils = require("../../utils");
generators = require("../../generators");
ShootingMove = require("../../move/ShootingMove");
RelocationMove = require("../../move/RelocationMove");
IdleMove = require("../../move/IdleMove");



class Archer extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Archer";
    }

    isBuilding() {
        return false;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.ARCHER;
    }

    generateMoves(game){
        let res = this.generateRelocationMoves(game);

        let shootingRangePoints = generators.generatePossibleRangedPointForArcher(this, game);
        for(let i = 0; i<shootingRangePoints.length; i++){
            let mv = new ShootingMove(this.position, shootingRangePoints[i], "Arrow");
            res.push(mv);
        }

        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new IdleMove());
        return res;
    }

    getWeapon() {
        return utils.GAME_PARAMS.WEAPON.BOW;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.NOTHING;
    }
}

module.exports = Archer;