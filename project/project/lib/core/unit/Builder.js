Unit = require("./Unit");
GoldMine = require("./GoldMine");
StoneMine = require("./StoneMine");
BuildingMove = require("./Barrack");
RelocationMove = require("../move/RelocationMove");
Barrack = require("./Barrack");
utils = require("../utils");
IdleMove = require("../move/IdleMove");
generators = require("../generators");


class Builder extends Unit{
    constructor(position, color){
        super(position, color);
    }

    generateMoves(game){
        let campZone = generators.generatePointsInDirections(this.position, utils.ALL_DIRECTIONS, 1, game, this.color, false, false);

        let res = [];
        for(let i = 0; i<campZone.length; i++){
            res.push(new RelocationMove(this.position, campZone[i], []));
        }

        let goldAvailable = this.getGoldInTreasury(game);
        let stoneAvailable = this.getStoneInTreasury(game);

        for(var i = 0; i<campZone.length; i++){
            var point = campZone[i];

            if(GoldMine.getPriceGold() <= goldAvailable && GoldMine.getPriceStone() <= stoneAvailable){
                var goldMine = new GoldMine(point, this.color);
                res.push(new BuildingMove(goldMine, GoldMine.getPriceGold(), GoldMine.getPriceStone()));
            }


            if(StoneMine.getPriceGold() <= goldAvailable && StoneMine.getPriceStone() <= stoneAvailable){
                var stoneMine = new StoneMine(point, this.color);
                res.push(new BuildingMove(stoneMine, StoneMine.getPriceGold(), StoneMine.getPriceStone()));
            }

            if(Barrack.getPriceGold() <= goldAvailable && Barrack.getPriceStone() <= stoneAvailable){
                var barrack = new Barrack(point, this.color);
                res.push(new BuildingMove(barrack, Barrack.getPriceGold(), Barrack.getPriceStone()));
            }
        }


        res.push(new IdleMove());
        return res;
    }
}

module.exports = Builder;