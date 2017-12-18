Move = require("./Move");
utils = require("../utils");
AppearUnitAction = require("../action/AppearUnitAction");
AttackUnitAction = require("../action/AttackUnitAction");
MoveUnitAction = require("../action//MoveUnitAction");
BuildUnitAction = require("../action//BuildUnitAction");


class BuildingMove extends Move{
    constructor(host, recruit, priceGold, priceIron, priceStone, priceFood){
        super();
        this.priceGold = priceGold;
        this.priceStone = priceStone;
        this.priceIron = priceIron;
        this.priceFood = priceFood;
        this.recruit = recruit;
        this.host = host;
        this.type = "Build";

        if(this.host === undefined){
            throw new utils.Exception("Undefined")
        }

        if(this.recruit === undefined){
            throw new utils.Exception("Undefined")
        }

    }

    assign(unit, game) {
        game.placeUnit(this.recruit);

        if (this.recruit.color === utils.WHITE) {
            game.whiteTreasury.gold -= this.priceGold;
            game.whiteTreasury.stone -= this.priceStone;
            game.whiteTreasury.iron -= this.priceIron;
            game.whiteTreasury.food -= this.priceFood;
        }

        if (this.recruit.color === utils.BLACK) {
            game.blackTreasury.gold -= this.priceGold;
            game.blackTreasury.stone -= this.priceStone;
            game.blackTreasury.iron -= this.priceIron;
            game.blackTreasury.food -= this.priceFood;
        }

        var res = [];
        let last = new AppearUnitAction(this.recruit);
        res.push(last);
        return res;
    }
}

module.exports = BuildingMove;