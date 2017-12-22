Unit = require("../../unit/Unit");
utils = require("../../utils");
BuildingMove = require("../../move/BuildingMove");
generators = require("../../generators");
IdleMove = require("../../move/IdleMove");


Swordsman = require("../combatant/Swordsman");
Spearman = require("../combatant/Spearman");
Archer = require("../combatant/Archer");
Knight = require("../combatant/Knight");
Horseman = require("../combatant/Horseman");
Catapult = require("../combatant/Catapult");
Priest = require("../combatant/Priest");
MountedPriest = require("../combatant/MountedPriest");



class Barrack extends Unit {
    constructor(position, color) {
        super(position, color);
        this.type = "Barrack";

        this.size = 5;

        this.height = [
            [1.5, 1.5, 1.5, 2.5, 1.5],
            [1.5, 4.0, 1.5, 1.5, 1.5],
            [2.0, 2.5, 0.0, 0.0, 2.0],
            [1.5, 1.5, 1.5, 1.5, 1.5],
            [2.5, 1.5, 1.5, 1.5, 2.5]
        ]

        this.mainHeight = 2.5;
    }


    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.STONE_BUILDING;
    }

    generateMoves(game) {
        var res = [];


        var swordsmanBuildingMoves = this.generateBuildingMoves(
            game,
            new Swordsman(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.SWORDSMAN.GOLD,
            utils.GAME_PARAMS.PRICE.SWORDSMAN.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, swordsmanBuildingMoves);



        var spearmanBuildingMoves = this.generateBuildingMoves(
            game,
            new Spearman(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.SPEARMAN.GOLD,
            utils.GAME_PARAMS.PRICE.SPEARMAN.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, spearmanBuildingMoves);


        var archerBuildingMoves = this.generateBuildingMoves(
            game,
            new Archer(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.ARCHER.GOLD,
            utils.GAME_PARAMS.PRICE.ARCHER.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, archerBuildingMoves);


        var horsemanBuildingMoves = this.generateBuildingMoves(
            game,
            new Horseman(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.HORSEMAN.GOLD,
            utils.GAME_PARAMS.PRICE.HORSEMAN.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, horsemanBuildingMoves);



        var knightBuildingMoves = this.generateBuildingMoves(
            game,
            new Knight(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.KNIGHT.GOLD,
            utils.GAME_PARAMS.PRICE.KNIGHT.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, knightBuildingMoves);


        var catapultBuildingMoves = this.generateBuildingMoves(
            game,
            new Catapult(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.CATAPULT.GOLD,
            utils.GAME_PARAMS.PRICE.CATAPULT.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, catapultBuildingMoves);

        res.push(new IdleMove());
        return res;
    }
}
module.exports = Barrack;