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

        this.mainHeight = 4;
    }


    updateIncome(game) {
        this.income = this.getIncome(game);
    }

    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.WOOD_BUILDING;
    }

    getIncome(game){
        var farmList = [];
        for(var i = 0; i<game.units.length; i++){
            if(game.units[i].type === "Farm"){
                farmList.push(game.units[i]);
            }
        }

        var totalIncome = 0;

        for(var i = 0; i<game.map.landscapeWater.length; i++){
            var well = game.map.landscapeWater[i];
            var totalE = 0;

            var currentE = null;
            var currentDist = 0;

            for(var j = 0; j<farmList.length; j++){
                var farm = farmList[j];
                var dist = utils.dist(farm.position, well);
                var e = Math.exp(-utils.GAME_PARAMS.FARM_DIST_K*(dist-2)*(dist-2));
                totalE += e;

                if(farm.position.hash() === this.position.hash()){
                    currentE = e;
                    currentDist = dist;
                }
            }

            var incomeK = utils.GAME_PARAMS.INCOME.FARM * Math.pow(utils.GAME_PARAMS.WELL_K, totalE);
            var incomeFromWell = incomeK * currentE;
            totalIncome += incomeFromWell;
        }

        return Math.round(totalIncome);
    }

    generateMoves(game){
        var income = this.getIncome(game);
        let res = new IncomeMove(0, 0, 0, income, this.color);
        return [res];
    }
}

module.exports = Farm;