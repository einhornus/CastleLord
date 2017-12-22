utils = require("../utils");
Action = require("./Action")
generators = require("../generators");


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
            var u = game.units[i];
            if(!u.isBuilding()) {
                u.speed = game.units[i].getSpeed();
            }
            else{
                u.speed = 0;
            }
            if(game.hasTower(u.position)){
                u.currentHeight = utils.GAME_PARAMS.TOWER_HEIGHT;
            }
            else{
                u.currentHeight = 0;
            }
            u.sightRadius = utils.GAME_PARAMS.SIGHT_RADIUS;

            u.updateIncome(game);
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
        //this.units = [];

        this.moves = moves;
        this.type = "Your move";

        this.obstacles = generators.makeObstacles(game);


        /*
        this.field1 = utils.create2DArray(game.map.width, game.map.height, 0);
        var sight = generators.generateSightPoints(unit, game);
        for(var i = 0; i<sight.length; i++){
            this.field1[sight[i].x][sight[i].y] = 100;
        }
        */

        //this.field1 = game.AIData.controlField;
    }
}

module.exports = YourMoveAction;
