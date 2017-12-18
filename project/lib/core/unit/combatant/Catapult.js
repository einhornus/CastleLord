Unit = require("../Unit");
utils = require("../../utils");
generators = require("../../generators");
ShootingMove = require("../../move/ShootingMove");
RelocationMove = require("../../move/RelocationMove");
IdleMove = require("../../move/IdleMove");



class Catapult extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Catapult";

    }

    isBuilding() {
        return false;
    }

    generateMoves(game){
        let res = this.generateRelocationMoves(game);

        let shootingRangePoints = generators.generatePossibleRangedPointForCatapult(this, game);
        for(let i = 0; i<shootingRangePoints.length; i++){
            let mv = new ShootingMove(this.position, shootingRangePoints[i], "Stone");
            res.push(mv);
        }

        res.push(new IdleMove());
        return res;
    }

    getRange(game){
        let range = utils.GAME_PARAMS.RANGE.CATAPULT;
        if(game.hasTower(this.position)){
            range += utils.GAME_PARAMS.RANGE.TOWER_PLUS;
        }
        return range;
    }

    getWeapon() {
        return utils.GAME_PARAMS.WEAPON.STONES;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.CATAPULT;
    }
}

module.exports = Catapult;