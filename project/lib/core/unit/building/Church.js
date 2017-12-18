Unit = require("../Unit");
Worker = require("../combatant/Worker");
Priest = require("../combatant/Priest");
MountedPriest = require("../combatant/MountedPriest");
utils = require("../../utils");
BuildingMove = require("../../move/BuildingMove");
generators = require("../../generators");
IdleMove = require("../../move/IdleMove");



class Church extends Unit {
    constructor(position, color) {
        super(position, color);
        this.type = "Church";

        this.size = 5;

        this.height = [
            [3.5, 3.5, 3.5, 3.5, 3.5],
            [4.5, 4.5, 4.5, 4.5, 4.5],
            [5.5, 5.5, 5.5, 5.5, 8.5],
            [4.5, 4.5, 4.5, 4.5, 4.5],
            [3.5, 3.5, 3.5, 3.5, 3.5],
        ]
    }

    isBuilding() {
        return true;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.STONE_BUILDING;
    }

    generateMoves(game) {
        let res = [];


        var priestBuildingMoves = this.generateBuildingMoves(
            game,
            new Priest(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.PRIEST.GOLD,
            utils.GAME_PARAMS.PRICE.PRIEST.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, priestBuildingMoves);


        var mountedPriestBuildingMoves = this.generateBuildingMoves(
            game,
            new MountedPriest(this.position, this.color),
            function(end, game){
                return true;
            },
            utils.GAME_PARAMS.PRICE.MOUNTED_PRIEST.GOLD,
            utils.GAME_PARAMS.PRICE.MOUNTED_PRIEST.IRON,
            0,
            0
        );
        res = utils.concatMoves(res, mountedPriestBuildingMoves);

        res.push(new IdleMove());
        return res;
    }
}
module.exports = Church;