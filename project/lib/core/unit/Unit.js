utils = require("../utils");
generators = require("../generators");
AttackMove = require("../move/AttackMove");
RelocationMove = require("../move/RelocationMove");
BuildingMove = require("../move/BuildingMove");
HealingMove = require("../move/HealingMove");
CaptureMove = require("../move/CaptureMove");

/*
Swordsman = require("../unit/combatant/Swordsman");
Spearman = require("../unit/combatant/Spearman");
Archer = require("../unit/combatant/Archer");
Knight = require("../unit/combatant/Knight");
Horseman = require("../unit/combatant/Horseman");
Catapult = require("../unit/combatant/Catapult");
Priest =  require("../unit/combatant/Priest");
MountedPriest =  require("../combatant/unit/MountedPriest");
*/


class Unit {
    constructor(position, color) {
        this.position = position;
        this.color = color;
        this.id = utils.genRandomString();
        this.health = 100.0;

        this.foodMorale = 0;
        this.priestMorale = 0;
        this.woundedMorale = 0;
        this.lordMorale = 0;
    }

    getWeapon() {
        throw new utils.Exception("Abstract method");
    }

    isPointInsideBuilding(point){
        if(Math.abs(point.x - this.position.x) <= Math.floor(this.size/2)){
            if(Math.abs(point.y - this.position.y) <= Math.floor(this.size/2)){
                return true;
            }
        }
        return false;
    }

    setSightPoints(game){
        var res = generators.generateSightPoints(this, game);
        this.sightPoints = res;
    }

    setRelocationPoints(game){
        var res = [];
        if(!this.isBuilding()){
            var rm = this.generateRelocationMoves(game);
            for(var i = 0; i<rm.length; i++){
                res.push(rm[i].end);
            }
        }
        this.relocationPoints = res;
    }

    static enumeratePointsInsideArea(position, size, game) {
        if(size === undefined){
            size = 1;
        }

        var res = [];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var newX = position.x + i - Math.floor(size / 2);
                var newY = position.y + j - Math.floor(size / 2);
                var newPoint = new utils.Point(newX, newY);
                if(utils.isPointValid(newPoint, game.map)) {
                    res.push(newPoint);
                }
            }
        }
        return res;
    }


    static generateAdvancedAdjacentCells(position, game, size){
        var res = [];
        for(var i = 0; i<size; i++){
            for(var j = 0; j<size; j++){
                if(i == 0 || j == 0 || i == size -1 || j == size - 1){
                    var newX = position.x + i - Math.floor(size/2);
                    var newY =  position.y+j - Math.floor(size/2);
                    var newPoint = new utils.Point(newX, newY);

                    var adjPoints = generators.getEmptyAdjacentCells(newPoint, game);
                    for(var k = 0; k<adjPoints.length; k++){
                        var contains = false;
                        for(var l = 0; l<res.length; l++){
                            if(res[l].hash() === adjPoints[k].hash()){
                                contains = true;
                                break;
                            }
                        }
                        if(!contains){
                            res.push(adjPoints[k]);
                        }
                    }
                }
            }
        }
        return res;
    }


    generateCaptureMoves(game){
        var res = [];
        for(var i = 0; i<game.units.length; i++){
            var unit = game.units[i];
            if(unit.isBuilding() && unit.color !== this.color) {
                if(unit.type === "Wall" || unit.type === "Gate") {
                }
                else{
                    var dx = Math.abs(unit.position.x - this.position.x);
                    var dy = Math.abs(unit.position.y - this.position.y);
                    var mx = Math.max(dx, dy);
                    var mn = Math.min(dx, dy);
                    var d = mx;

                    if (d === Math.floor(unit.size / 2) + 1) {
                        var move = new CaptureMove(this.position, unit);
                        res.push(move);
                    }
                }
            }

        }
        return res;
    }


    generateBuildingMoves(game, unit, condition, priceGold, priceIron, priceStone, priceFood) {
        let buildingPoints = null;


        if(this.size !== undefined) {
            buildingPoints = Unit.generateAdvancedAdjacentCells(this.position, game, this.size);
        }
        else{
            if(unit.size === undefined || unit.size === 1) {
                buildingPoints = generators.getEmptyAdjacentCells(this.position, game);
            }
            else{
                var p1 = new utils.Point(this.position.x + Math.floor(unit.size/2) + 1, this.position.y + Math.floor(unit.size/2) + 1);
                var p2 = new utils.Point(this.position.x + Math.floor(unit.size/2) + 1, this.position.y - Math.floor(unit.size/2) - 1);
                var p3 = new utils.Point(this.position.x - Math.floor(unit.size/2) - 1, this.position.y + Math.floor(unit.size/2) + 1);
                var p4 = new utils.Point(this.position.x - Math.floor(unit.size/2) - 1, this.position.y - Math.floor(unit.size/2) - 1);
                buildingPoints = [p1, p2, p3, p4];
            }
        }

        var newBuildingPoints = [];
        for(var i = 0; i<buildingPoints.length; i++){
            var size = unit.size;
            var pointsInsideArea = Unit.enumeratePointsInsideArea(buildingPoints[i], size, game);
            var good = true;
            for(var j = 0; j<pointsInsideArea.length; j++){
                var tile = pointsInsideArea[j];
                if(tileChecker.isTileOccupiedByUnit(game, tile) || tileChecker.isTileOccupiedByTree(game, tile) || tileChecker.isTileOccupiedByWater(game, tile)){
                    good = false;
                    break;
                }
            }
            if(good){
                if(utils.isPointValid(buildingPoints[i], game.map)) {
                    newBuildingPoints.push(buildingPoints[i]);
                }
            }
        }

        buildingPoints = newBuildingPoints;

        var res = [];
        for (var i = 0; i < buildingPoints.length; i++) {
            if (game.matrix[buildingPoints[i].x][buildingPoints[i].y] === null) {
                var consider = game.map.passable[buildingPoints[i].x][buildingPoints[i].y];
                if (game.map.isDeposit(buildingPoints[i])) {
                    consider = true;
                }
                if (consider) {
                    var point = this.position;
                    var end = buildingPoints[i];

                    var newUnit = utils.clone(unit);
                    newUnit.position = end;

                    if (condition(end, game)) {
                        var buildMove = new BuildingMove(
                            this,
                            newUnit,
                            priceGold,
                            priceIron,
                            priceStone,
                            priceFood);
                        if (this.isEnoughResources(buildMove, game)) {
                            res.push(buildMove);
                        }
                    }
                }
            }
        }
        return res;
    }

    getArmour() {
        throw new utils.Exception("Abstract method");
    }

    generateMoves(game) {
        throw utils.Exception("Abstract method");
    }

    getFoodConsumption() {
        throw utils.Exception("Abstract method");
    }

    isBuilding() {
        throw utils.Exception("Abstract method");
    }

    getMyTreasury(game) {
        if (this.color === utils.WHITE) {
            return game.whiteTreasury;
        }
        else {
            return game.blackTreasury;
        }
    }

    consumeFood(game) {
        var myTreasury = this.getMyTreasury(game);
        if (myTreasury.food >= this.getFoodConsumption()) {
            myTreasury.food -= this.getFoodConsumption();
            this.foodMorale = Math.round(utils.GAME_PARAMS.MORALE_FOOD_ENOUGH);
        }
        else {
            this.foodMorale = Math.round(utils.GAME_PARAMS.MORALE_FOOD_NOT_ENOUGH);
        }
    }

    postMove(game) {
        this.morale = 0;

        if (this.isBuilding === undefined) {
            throw new utils.Exception("Weird");
        }

        if (this.type === "House") {
            this.consumeFood(game);
        }

        if (!this.isBuilding() && !(this.type === "Catapult")) {
            this.consumeFood(game);

            if (!(this.type === "Priest" || this.type === "Mounted priest")) {
                var distToPriest = null;
                for (var unit in game.units) {
                    if (unit.color === this.color) {
                        if (unit instanceof Priest || unit instanceof MountedPriest) {
                            var dist = utils.dist(this.position, unit.positions);
                            if (distToPriest === null) {
                                distToPriest = dist;
                            }
                            else {
                                distToPriest = Math.min(dist, distToPriest);
                            }
                        }
                    }
                }
                if (distToPriest = null) {
                    var surplus = utils.GAME_PARAMS.MORALE_PRIEST_NEARBY_K / (utils.GAME_PARAMS.MORALE_PRIEST_NEARBY_O + distToPriest);
                    this.priestMorale = Math.round(surplus);
                }
                else {
                    this.priestMorale = 0;
                }
            }

            var wounded = utils.GAME_PARAMS.MORALE_WOUNDED_K * (100.0 - this.health);
            this.woundedMorale = Math.round(wounded);

            if (this.type === "Lord") {
                this.lordMorale = Math.round(10.0);
            }

            this.morale = this.woundedMorale + this.lordMorale + this.priestMorale + this.foodMorale;
            var t = 0;
        }

    }

    getMorale() {
        return utils.getMorale(this.morale);
    }

    getSpeed() {
        return utils.getSpeed(this.getArmour(), this.getMorale());
    }

    getMoraleAttackModifier() {
        return utils.getMoraleAttackModifier(this.getMorale());
    }

    getMoraleDefenceModifier() {
        return utils.getMoraleDefenceModifier(this.getMorale());
    }

    isEnoughResources(buildingMove, game) {
        let treasury = null;
        if (this.color === utils.WHITE) {
            treasury = game.whiteTreasury;
        }
        else {
            treasury = game.blackTreasury;
        }

        if (treasury.gold < buildingMove.priceGold) {
            return false;
        }

        if (treasury.iron < buildingMove.priceIron) {
            return false;
        }

        if (treasury.stone < buildingMove.priceStone) {
            return false;
        }

        if (treasury.food < buildingMove.priceFood) {
            return false;
        }
        return true;
    }

    generateApproachPoints(game, condition) {
        var res = [];
        let movesMap = generators.generatePossibleMoves(this, game);
        for (let i = 0; i < game.map.width; i++) {
            for (let j = 0; j < game.map.height; j++) {
                if (condition(this, game, i, j)) {
                    var point = new utils.Point(i, j);
                    var adjCells = generators.getPassableAdjacentCells(point, game);
                    for (var k = 0; k < adjCells.length; k++) {
                        var adj = adjCells[k];
                        var adjValue = movesMap[adj.x][adj.y];
                        if (adjValue !== null) {
                            if (adjValue.d <= this.getSpeed() - 1) {
                                var end = adj;
                                var path = [];

                                let currentStart = this.position;
                                for (var m = 1; m < adjValue.path.length; m++) {
                                    let currentEnd = adjValue.path[m];
                                    path.push({from: currentStart, to: currentEnd});
                                    currentStart = currentEnd;
                                }

                                if (currentStart.hash() !== end.hash()) {
                                    path.push({from: currentStart, to: end});
                                }

                                res.push([end, path, point]);
                            }
                        }
                    }
                }
            }
        }
        return res;
    }


    generateHealingMoves(game) {
        var condition = function (unit, game, i, j) {
            var gm = game.matrix[i][j];
            if (gm === null) {
                return false;
            }

            if (gm.color !== unit.color || gm.isBuilding()) {
                return false;
            }

            if(unit.position.hash() === gm.position.hash()){
                return false;
            }

            return true;
        }

        var points = this.generateApproachPoints(game, condition);
        let res = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var enemyPoint = point[2];
            var path = point[1];
            var end = point[0]
            var enemy = game.matrix[enemyPoint.x][enemyPoint.y];

            if (enemy.health === 100) {
            }
            else {
                res.push(new HealingMove(end, path, enemy));
            }
        }
        return res;
    }

    generateAttackingMoves(game) {
        var condition = function (unit, game, i, j) {
            if (game.matrix[i][j] === null) {
                return false;
            }

            if (game.matrix[i][j].color === unit.color) {
                return false;
            }

            return true;
        }

        var points = this.generateApproachPoints(game, condition);
        let res = [];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var enemyPoint = point[2];
            var path = point[1];
            var end = point[0]
            var enemy = game.matrix[enemyPoint.x][enemyPoint.y];

            if (game.calculateDamage(this, enemy) === 0) {
            }
            else {
                res.push(new AttackMove(end, path, enemy));
            }
        }
        return res;
    }

    generateRelocationMoves(game) {
        let movesMap = generators.generatePossibleMoves(this, game);
        let res = [];
        for (let i = 0; i < game.map.width; i++) {
            for (let j = 0; j < game.map.height; j++) {
                if (movesMap[i][j] !== null) {
                    let end = new utils.Point(i, j);
                    let path = [];

                    let currentStart = this.position;
                    let sh = movesMap[i][j];

                    if (sh.d !== 0) {
                        for (var k = 1; k < sh.path.length; k++) {
                            let currentEnd = sh.path[k];
                            path.push({from: currentStart, to: currentEnd});
                            currentStart = currentEnd;
                        }
                        path.push({from: currentStart, to: end});

                        if (path.length > 0) {
                            res.push(new RelocationMove(end, path));
                        }
                    }
                }
            }
        }
        return res;
    }
}

module.exports = Unit;