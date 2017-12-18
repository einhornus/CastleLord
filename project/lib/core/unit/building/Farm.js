Unit = require("../Unit");
utils = require("../../utils");
IncomeMove = require("../../move/IncomeMove");
tileChecker = require("../../tileChecker");


class Farm extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Farm";

        this.size = 3;

        this.height = [
            [3.0, 3.0, 3.0],
            [4.0, 4.0, 4.0],
            [4.0, 4.0, 4.0],
        ]
    }

    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.WOOD_BUILDING;
    }

    getIncome(){
        var farms = 0;
        var adjZone = Unit.enumeratePointsInsideArea(this.position, 5, game);

        var well = null;

        for(var i = 0; i<adjZone.length; i++){
            if(tileChecker.isTileOccupiedByWater(game, adjZone[i])){
                well = adjZone[i]
            }
        }

        if(well === null){
            throw utils.Exception("No well for a farm");
        }
        else {
            var wellZone = Unit.enumeratePointsInsideArea(well, 5, game);
            var farms = 0;

            for (var i = 0; i < wellZone.length; i++) {
                if (game.matrix[wellZone[i].x][wellZone[i].y] !== null) {
                    if (game.matrix[wellZone[i].x][wellZone[i].y].type === "Farm") {
                        farms++;
                    }
                }
            }

            var k = Math.pow(0.8, farms);
            var income = Math.round(utils.GAME_PARAMS.INCOME.FARM * k);
            return income;
        }
    }

    generateMoves(game){
        var farms = 0;
        var adjZone = Unit.enumeratePointsInsideArea(this.position, 5, game);

        var well = null;

        for(var i = 0; i<adjZone.length; i++){
            if(tileChecker.isTileOccupiedByWater(game, adjZone[i])){
                well = adjZone[i]
            }
        }

        if(well === null){
            throw utils.Exception("No well for a farm");
        }
        else{
            var wellZone = Unit.enumeratePointsInsideArea(well, 5, game);
            var farms = 0;

            for(var i = 0; i<wellZone.length; i++){
                if(game.matrix[wellZone[i].x][wellZone[i].y] !== null){
                    if(game.matrix[wellZone[i].x][wellZone[i].y].type === "Farm"){
                        farms++;
                    }
                }
            }

            var k = Math.pow(0.8, farms);
            var income = Math.round(utils.GAME_PARAMS.INCOME.FARM * k);

            let res = new IncomeMove(0, 0, 0, income, this.color);
            return [res];


        }
    }
}

module.exports = Farm;