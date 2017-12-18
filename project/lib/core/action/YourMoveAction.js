utils = require("../utils");
Action = require("./Action")


class YourMoveAction extends Action{
    constructor(unit, moves, game){
        super();

        if(unit === undefined){
            throw new utils.Exception("Not defined");
        }

        if(moves === undefined){
            throw new utils.Exception("Not defined");
        }

        this.unit = unit;


        for(var i = 0; i<game.units.length; i++){
            if(!game.units[i].isBuilding()) {
                game.units[i].speed = game.units[i].getSpeed();
            }
            else{
                game.units[i].speed = 0;
            }
        }


        var treasury = null;
        var color = game.getCurrentUnit().color;

        if(color === utils.WHITE){
            treasury = game.whiteTreasury;
        }
        else{
            treasury = game.blackTreasury;
        }

        this.foodAmount = treasury.food;
        this.stoneAmount = treasury.stone;
        this.ironAmount = treasury.iron;
        this.goldAmount = treasury.gold;

        this.foodIncome = game.getFoodIncome(color);
        this.goldIncome = game.getGoldIncome(color);
        this.stoneIncome = game.getStoneIncome(color);
        this.ironIncome = game.getIronIncome(color);

        this.width = game.map.width;
        this.height = game.map.height;

        this.units = game.units;
        this.moves = moves;
        this.type = "Your move";

        this.obstacles = generators.makeObstacles(game);
    }
}

module.exports = YourMoveAction;
