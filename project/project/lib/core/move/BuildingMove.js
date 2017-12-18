Move = require("./Move");

class BuildingMove extends Move{
    constructor(unit, priceGold, priceStone){
        super();
        this.unit = unit;
        this.priceGold = priceGold;
        this.priceStone = priceStone;
    }
}

module.exports = BuildingMove;