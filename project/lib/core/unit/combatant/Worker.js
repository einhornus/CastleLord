Unit = require("../Unit");
BuildingMove = require("../building/Barrack");
RelocationMove = require("../../move/RelocationMove");
Map = require("../../map/Map");


Barrack = require("../building/Barrack");
Church = require("../building/Church");
Farm = require("../building/Farm");
GoldMine = require("../building/House");
IronMine = require("../building/IronMine");
Quarry = require("../building/Quarry");
Wall = require("../building/Wall");
Tower = require("../building/Tower");
House = require("../building/House");

utils = require("../../utils");
IdleMove = require("../../move/IdleMove");
generators = require("../../generators");


class Worker extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Worker";
    }

    isBuilding() {
        return false;
    }

    getFoodConsumption() {
        return utils.GAME_PARAMS.FOOD_CONSUMPTION.WORKER;
    }

    generateMoves(game){
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let res = utils.concatMoves(rel, attack);

        var condition = function (unit, game, i, j) {
            if (game.matrix[i][j] === null) {
                if(game.map.passable[i][j]){
                    return true;
                }
            }
            return false;
        }

        if(game.whiteTreasury.gold === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.whiteTreasury.iron === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.whiteTreasury.food === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.whiteTreasury.stone === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.blackTreasury.gold === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.blackTreasury.iron === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.blackTreasury.food === undefined){
            throw new utils.Exception("Undefined treasury");
        }

        if(game.blackTreasury.stone === undefined){
            throw new utils.Exception("Undefined treasury");
        }




        var farmBuildingMoves = this.generateBuildingMoves(
            game,
            new Farm(this.position, this.color),
            function(end, game){
                return Map.canPlaceFarm(end, game);
            },
            utils.GAME_PARAMS.PRICE.FARM.GOLD,
            0,
            0,
            0
        );

        res = utils.concatMoves(res, farmBuildingMoves);



        var churchBuildingMoves = this.generateBuildingMoves(
            game,
            new Church(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.CHURCH.GOLD,
            0,
            utils.GAME_PARAMS.PRICE.CHURCH.STONE,
            0
        );
        res = utils.concatMoves(res, churchBuildingMoves);



        var barracksBuildingMoves = this.generateBuildingMoves(
            game,
            new Barrack(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.BARRACKS.GOLD,
            0,
            utils.GAME_PARAMS.PRICE.BARRACKS.STONE,
            0
        );

        res = utils.concatMoves(res, barracksBuildingMoves);






        var ironMineBuildingMoves = this.generateBuildingMoves(
            game,
            new IronMine(this.position, this.color),
            function(end, game){
                return Map.canPlaceIronMine(end, game);
            },
            utils.GAME_PARAMS.PRICE.MINE.GOLD,
            0,
            0,
            0
        );

        res = utils.concatMoves(res, ironMineBuildingMoves);




        var quarryBuildingMoves = this.generateBuildingMoves(
            game,
            new Quarry(this.position, this.color),
            function(end, game){
                return Map.canPlaceQuarry(end, game);
            },
            utils.GAME_PARAMS.PRICE.MINE.GOLD,
            0,
            0,
            0
        );

        res = utils.concatMoves(res, quarryBuildingMoves);



        var wallBuildingMoves = this.generateBuildingMoves(
            game,
            new Wall(this.position, this.color),
            function(end, game){
                return true;
            },
            0,
            0,
            utils.GAME_PARAMS.PRICE.WALL.STONE,
            0
        );

        res = utils.concatMoves(res, wallBuildingMoves);



        var towerBuildingMoves = this.generateBuildingMoves(
            game,
            new Tower(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.TOWER.GOLD,
            0,
            utils.GAME_PARAMS.PRICE.TOWER.STONE,
            0
        );

        res = utils.concatMoves(res, towerBuildingMoves);



        var houseBuildingMoves = this.generateBuildingMoves(
            game,
            new House(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.HOUSE.GOLD,
            0,
            0,
            0
        );

        res = utils.concatMoves(res, houseBuildingMoves);


        var captureMoves = this.generateCaptureMoves(game);
        res = utils.concatMoves(res, captureMoves);

        res.push(new IdleMove());
        return res;
    }

    getWeapon() {
        return utils.GAME_PARAMS.WEAPON.HAMMER;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.NOTHING;
    }
}

module.exports = Worker;