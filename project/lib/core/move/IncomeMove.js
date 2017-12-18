var Move = require("./Move");
utils = require("../utils");

class IncomeMove extends Move{
    constructor(plusGold, plusIron, plusStone, plusFood, color){
        super();
        this.plusGold = plusGold;
        this.plusStone = plusStone;
        this.plusFood = plusFood;
        this.plusIron = plusIron;
        this.color = color;
        this.type = "Income";
    }


    assign(unit, game) {
        var color = this.color;
        if (color === utils.WHITE) {
            game.whiteTreasury.gold += this.plusGold;
            game.whiteTreasury.stone += this.plusStone;
            game.whiteTreasury.food += this.plusFood;
            game.whiteTreasury.iron += this.plusIron;
        }
        if (color === utils.BLACK) {
            game.blackTreasury.gold += this.plusGold;
            game.blackTreasury.stone += this.plusStone;
            game.blackTreasury.food += this.plusFood;
            game.blackTreasury.iron += this.plusIron;
        }
        return [];
    }
}

module.exports = IncomeMove;