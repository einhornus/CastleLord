Unit = require("./Unit");
utils = require("../utils");
generators = require("../generators");
ShootingMove = require("../move/ShootingMove");
RelocationMove = require("../move/RelocationMove");
IdleMove = require("../move/IdleMove");



class Archer extends Unit{
    constructor(position, color){
        super(position, color);
    }

    generateMoves(game){
        let res = [];

        let shootingRangePoints = generators.generatePointsInDirections(this.position, utils.ALL_DIRECTIONS, utils.ARCHER_SHOOTING_RANGE, game, this.color, true, false);
        let movingRangeStructures = generators.generatePointsInDirections(this.position, utils.ALL_DIRECTIONS, utils.ARCHER_MOVING_RANGE, game, this.color, false, true);

        for(let i = 0; i<shootingRangePoints.length; i++){
            let mv = new ShootingMove(this.position, shootingRangePoints[i]);
            res.push(mv);
        }

        for(let i = 0; i<movingRangeStructures.length; i++){
            let mv = new RelocationMove(this.position, movingRangeStructures[i].end, movingRangeStructures[i].inters);
            res.push(mv);
        }

        res.push(new IdleMove());
        return res;
    }

    static getPriceGold(){
        return 1;
    }

    static getPriceStone(){
        return 0;
    }
}

module.exports = Archer;