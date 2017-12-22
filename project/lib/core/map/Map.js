utils = require("../utils");
generators = require("../generators");

class Map {
    constructor(width, height) {
        this.initialWhiteTreasury = null;
        this.initialBlackTreasury = null;
        this.initialWhiteKingPosition = new utils.Point(0, 0);
        this.initialBlackKingPosition = new utils.Point(width - 1, height - 1);
        this.width = width;
        this.height = height;

        this.passable = utils.create2DArray(width, height, true);
        this.trees = utils.create2DArray(width, height, false);
        this.treesArray = [];
        this.empty = utils.create2DArray(width, height, true);
        this.stoneDeposits = utils.create2DArray(width, height, false);
        this.ironDeposits = utils.create2DArray(width, height, false);

        this.water = utils.create2DArray(width, height, false);
        this.waterArray = [];

        this.initialTroops = [];

        this.landscapeTrees = [];
        this.landscapeStoneDeposits = [];
        this.landscapeIronDeposits = [];
        this.landscapeWater = [];
    }

    isEmpty(point) {
        return this.empty[point.x][point.y];
    }

    addWater(point) {
        this.passable[point.x][point.y] = false;
        this.empty[point.x][point.y] = false;
        this.water[point.x][point.y] = true;
        this.landscapeWater.push(point);
        this.waterArray.push(point);
    }



    isDeposit(point) {
        if (this.stoneDeposits[point.x][point.y]) {
            return true;
        }

        if (this.ironDeposits[point.x][point.y]) {
            return true;
        }

        return false;
    }

    addIronDeposit(point) {
        this.ironDeposits[point.x][point.y] = true;
        this.empty[point.x][point.y] = false;
        this.passable[point.x][point.y] = false;
        this.landscapeIronDeposits.push(point);
    }

    addStoneDeposit(point) {
        this.stoneDeposits[point.x][point.y] = true;
        this.empty[point.x][point.y] = false;
        this.passable[point.x][point.y] = false;
        this.landscapeStoneDeposits.push(point);
    }

    addTree(point) {
        var x = Math.round(point.x);
        var y = Math.round(point.y);
        this.landscapeTrees.push(new utils.Point(Math.round(point.x * 1000), Math.round(point.y * 1000)));
        var actualPoint = new utils.Point(x, y);
        if (utils.isPointValid(actualPoint, this)) {
            this.passable[actualPoint.x][actualPoint.y] = false;
            this.trees[actualPoint.x][actualPoint.y] = true;
            this.empty[point.x][point.y] = false;
            this.treesArray.push(actualPoint);
        }
    }

    static canPlaceFarm(point, game) {
        return true;
    }

    static canPlaceQuarry(point, game) {
        return game.map.stoneDeposits[point.x][point.y];
    }



    static canPlaceIronMine(point, game) {
        return game.map.ironDeposits[point.x][point.y];
    }
}


module.exports = Map;