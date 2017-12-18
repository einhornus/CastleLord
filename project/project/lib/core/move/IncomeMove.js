var Move = require("./Move");

class IncomeMove extends Move{
    constructor(plusGold, plusStone, color){
        super();
        this.plusGold = plusGold;
        this.plusStone = plusStone;
        this.color = color;
    }
}

module.exports = IncomeMove;