Unit = require("./Unit");
GoldMine = require("./GoldMine");
StoneMine = require("./StoneMine");
BuildingMove = require("./Barrack");
RelocationMove = require("../move/RelocationMove");
Barrack = require("./Barrack");
utils = require("../utils");
generators = require("../generators");
IdleMove = require("../move/IdleMove");


class King extends Unit{
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
}

module.exports = King;