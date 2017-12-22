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

        this.mainHeight = 1.0;
    }

    isBuilding() {
        return false;
    }

    generateMoves(game){
        let res = this.generateRelocationMoves(game);

        let shootingRangePoints = generators.generatePossibleRangedPoints(this, game, true);
        for(let i = 0; i<shootingRangePoints.length; i++){
            var enemy = null;
            if(game.matrix[shootingRangePoints[i].x][shootingRangePoints[i].y] !== null){
                enemy = game.matrix[shootingRangePoints[i].x][shootingRangePoints[i].y];
            }
            else{
                enemy = game.towers[shootingRangePoints[i].x][shootingRangePoints[i].y];
            }
            let mv = new ShootingMove(this.position, shootingRangePoints[i], enemy, "Stone");
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