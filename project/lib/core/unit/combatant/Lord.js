Unit = require("../Unit");
GoldMine = require("../building/House");
StoneMine = require("../building/IronMine");
BuildingMove = require("../building/Barrack");
RelocationMove = require("../../move/RelocationMove");
Barrack = require("../building/Barrack");
utils = require("../../utils");
generators = require("../../generators");
IdleMove = require("../../move/IdleMove");
AttackMove = require("../../move/AttackMove");
ChangeStateMove = require("../../move/ChangeStateMove");


class Lord extends Knight {
    constructor(position, color) {
        super(position, color);
        this.type = "Lord";

        this.mainHeight = 1.3;
    }


    generateMoves(game) {
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let res = utils.concatMoves(rel, attack);

        var workerBuildingMoves = this.generateBuildingMoves(
            game,
            new Worker(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.WORKER.GOLD,
            utils.GAME_PARAMS.PRICE.WORKER.IRON,
            0,
            0
        );

        res = utils.concatMoves(res, workerBuildingMoves);

        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new ChangeStateMove(this));
        res.push(new IdleMove());
        return res;
    }
}

module.exports = Lord;