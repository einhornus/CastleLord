Unit = require("./Unit");
Peasant = require("./Peasant");
utils = require("../utils");
BuildingMove = require("../move/BuildingMove");
generators = require("../generators");
IdleMove = require("../move/IdleMove");



class Barrack extends Unit {
    constructor(position, color) {
        super(position, color);
    }

    generateMoves(game) {
        let campZone = generators.generatePointsInDirections(this.position, utils.ALL_DIRECTIONS, 1, game, this.color, false, false);

        let res = [];
        var goldAvailable = this.getGoldInTreasury(game);
        var stoneAvailable = this.getStoneInTreasury(game);

        for (var i = 0; i < campZone.length; i++) {
            if (Peasant.getPriceGold() <= goldAvailable && Peasant.getPriceStone() <= stoneAvailable) {
                var peasant = new Peasant(campZone[i], this.color);
                res.push(new BuildingMove(peasant, Peasant.getPriceGold(), Peasant.getPriceStone()));
            }
        }

        res.push(new IdleMove());
        return res;
    }

    static getPriceGold()
    {
        return 0;
    }

    static getPriceStone()
    {
        return 5;
    }
}
module.exports = Barrack;