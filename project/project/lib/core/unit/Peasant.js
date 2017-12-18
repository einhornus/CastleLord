Unit = require("./Unit");
utils = require("../utils");
generators = require("../generators");
RelocationMove = require("../move/RelocationMove");
IdleMove = require("../move/IdleMove");


class Peasant extends Unit{
    constructor(position, color){
        super(position, color);
    }

    generateMoves(game){
        let mvs = generators.generatePointsInDirections(this.position, utils.ALL_DIRECTIONS, 1, game, this.color, false, false);
        let res = []
        for(let i = 0; i<mvs.length; i++){
            res.push(new RelocationMove(this.position, mvs[i], []));
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

module.exports = Peasant;