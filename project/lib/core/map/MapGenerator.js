utils = require("../utils");
Treasury = require("../Treasury");
generators = require("../generators");
Archer = require("../unit/combatant/Archer");
Bear = require("../unit/combatant/Bear");
Catapult = require("../unit/combatant/Catapult");
Barrack = require("../unit/building/Barrack");
Church = require("../unit/building/Church");
Wall = require("../unit/building/Wall");
Gate = require("../unit/building/Gate");
Tower = require("../unit/building/Tower");
MapSettings = require("./MapSettings");


getGaussianNumber = function (mean, stdDerivation) {
    var phi = Math.random();
    var r = Math.random();
    var z = Math.cos(2 * phi * Math.PI) * Math.sqrt(-2 * Math.log(r));
    var res = mean + z * stdDerivation;
    return res;
}

class MapCastle {
    constructor(centerX, centerY, sizeX, sizeY, inversed) {
        this.inversed = inversed;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.centerX = centerX;
        this.centerY = centerY;
    }

    getPoint(obj) {
        if (this.inversed) {
            return {x: obj.y + this.centerX, y: obj.x + this.centerY};
        }
        else {
            return {x: obj.x + this.centerX, y: obj.y + this.centerY};
            ;
        }
    }

    getWidthX() {
        return Math.floor(this.sizeX / 2);
    }

    getWidthY() {
        return Math.floor(this.sizeY / 2);
    }

    getGates() {
        var res = [
            this.getPoint({x: 0, y: -this.getWidthY()}),
            this.getPoint({x: 0, y: this.getWidthY()})
        ];
        return res;
    }

    getTowers() {
        var res = [];
        res.push(this.getPoint({x: -this.getWidthX() + 1, y: -this.getWidthY() + 1}));
        res.push(this.getPoint({x: this.getWidthX() - 1, y: -this.getWidthY() + 1}));
        res.push(this.getPoint({x: this.getWidthX() - 1, y: this.getWidthY() - 1}));
        res.push(this.getPoint({x: -this.getWidthX() + 1, y: this.getWidthY() - 1}));
        return res
    }

    getWalls() {
        var res = [];
        for (var i = -this.getWidthX(); i <= this.getWidthX(); i++) {
            if (i !== 0) {
                var x = i;
                var y1 = -this.getWidthY();
                var y2 = this.getWidthY();

                var wall1 = this.getPoint({x: x, y: y1})
                var wall2 = this.getPoint({x: x, y: y2})

                res.push(wall1);
                res.push(wall2);
            }
        }

        for (var i = -this.getWidthY() + 1; i <= this.getWidthY() - 1; i++) {
            var y = i;
            var x1 = -this.getWidthX();
            var x2 = this.getWidthX();

            var wall1 = this.getPoint({x: x1, y: i})
            var wall2 = this.getPoint({x: x2, y: i})

            res.push(wall1);
            res.push(wall2);
        }

        return res
    }

    isInsideCastle(x, y) {
        var leftBottom = this.getPoint({x: -this.getWidthX() - 1, y: -this.getWidthY() - 1});
        var rightTop = this.getPoint({x: this.getWidthX() + 1, y: this.getWidthY() + 1});

        if (x >= leftBottom.x && x <= rightTop.x) {
            if (y >= leftBottom.y && y <= rightTop.y) {
                return true;
            }
        }

        return false;
    }
}


function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

getPlaceForACastle = function (sizeX, sizeY, color, castleSize) {
    var minX = null;
    var maxX = null;
    var minY = null;
    var maxY = null;

    if (color === utils.WHITE) {
        minX = castleSize;
        maxX = sizeX / 3 - castleSize;
    }
    else {
        minX = castleSize + 2 * sizeX / 3;
        maxX = sizeX - castleSize;
    }

    minY = castleSize;
    maxY = sizeY - castleSize;

    var x = randomInteger(minX, maxX);
    var y = randomInteger(minY, maxY);
    return {x: x, y: y};
}


genPoints = function (map, count, whiteCastle, blackCastle) {
    var res = [];
    for (var i = 0; i < count; i++) {
        var x = Math.round(Math.random() * (map.width - 1));
        var y = Math.round(Math.random() * (map.height - 1));
        var point = new utils.Point(x, y);
        if (map.isEmpty(point)) {
            if (!whiteCastle.isInsideCastle(x, y) && !blackCastle.isInsideCastle(x, y)) {
                res.push(point);
            }
        }
    }
    return res;
}


tryGenerate = function (settings) {
    var mapOffset = 10;

    var map = new Map(settings.sizeX, settings.sizeY);

    var castleSize = Math.max(settings.castleSizeX, settings.castleSizeY);

    var placeForWhiteCastle = getPlaceForACastle(settings.sizeX, settings.sizeY, utils.WHITE, castleSize);
    var placeForBlackCastle = getPlaceForACastle(settings.sizeX, settings.sizeY, utils.BLACK, castleSize);

    var whiteCastleInverted = 1;//(randomInteger(0, 1) === 0);
    var blackCastleInverted = 1;//(randomInteger(0, 1) === 0);

    var whiteCastle = new MapCastle(placeForWhiteCastle.x, placeForWhiteCastle.y, settings.castleSizeX, settings.castleSizeY, whiteCastleInverted);
    var blackCastle = new MapCastle(placeForBlackCastle.x, placeForBlackCastle.y, settings.castleSizeX, settings.castleSizeY, blackCastleInverted);




    var whiteTowers = whiteCastle.getTowers();
    for (var i = 0; i < whiteTowers.length; i++) {
        var tower = whiteTowers[i];
        var whiteTower = new Tower(new utils.Point(tower.x, tower.y), utils.WHITE);
        map.initialTroops.push(whiteTower);

    }

    var blackTowers = blackCastle.getTowers();
    for (var i = 0; i < blackTowers.length; i++) {
        var tower = blackTowers[i];
        var blackTower = new Tower(new utils.Point(tower.x, tower.y), utils.BLACK);
        map.initialTroops.push(blackTower);
    }



    var whiteWalls = whiteCastle.getWalls();
    for (var i = 0; i < whiteWalls.length; i++) {
        var wall = whiteWalls[i];
        var whiteWall = new Wall(new utils.Point(wall.x, wall.y), utils.WHITE);
        map.initialTroops.push(whiteWall);

    }

    var blackWalls = blackCastle.getWalls();
    for (var i = 0; i < blackWalls.length; i++) {
        var wall = blackWalls[i];
        var blackWall = new Wall(new utils.Point(wall.x, wall.y), utils.BLACK);
        map.initialTroops.push(blackWall);
    }


    var whiteGates = whiteCastle.getGates();
    for (var i = 0; i < whiteGates.length; i++) {
        var gate = whiteGates[i];
        var whiteGate = new Gate(new utils.Point(gate.x, gate.y), utils.WHITE);
        map.initialTroops.push(whiteGate);

    }

    var blackGates = blackCastle.getGates();
    for (var i = 0; i < whiteGates.length; i++) {
        var gate = blackGates[i];
        var blackGate = new Gate(new utils.Point(gate.x, gate.y), utils.BLACK);
        map.initialTroops.push(blackGate);
    }


    map.initialWhiteTreasury = new Treasury(settings.initialGold, settings.initialIron, settings.initialStone, settings.initialFood);
    map.initialBlackTreasury = new Treasury(settings.initialGold, settings.initialIron, settings.initialStone, settings.initialFood);

    map.initialWhiteKingPosition = new utils.Point(placeForWhiteCastle.x, placeForWhiteCastle.y);
    map.initialBlackKingPosition = new utils.Point(placeForBlackCastle.x, placeForBlackCastle.y);

    var trees = 0;
    var forestCount = settings.forestCount;

    for (var i = 0; i < forestCount; i++) {
        var centerX = randomInteger(-mapOffset, map.width + mapOffset);
        var centerY = randomInteger(-mapOffset, map.height + mapOffset);

        var treesCount = Math.round(getGaussianNumber(settings.forestSizeMean, settings.forestSizeDerivation));


        for (var j = 0; j < treesCount; j++) {
            var distance = getGaussianNumber(settings.forestDistanceMean, settings.forestDistanceDerivation);
            var angle = Math.random() * Math.PI * 2;
            var x = Math.round(centerX + Math.cos(angle) * distance);
            var y = Math.round(centerY + Math.sin(angle) * distance);
            if (!whiteCastle.isInsideCastle(x, y) && !blackCastle.isInsideCastle(x, y)) {
                map.addTree(new utils.Point(x, y));
            }
            trees++;
        }
    }


    var goldDepositPoints = genPoints(map, settings.goldDepositCount, whiteCastle, blackCastle);
    for (var i = 0; i < goldDepositPoints.length; i++) {
        map.addGoldDeposit(goldDepositPoints[i]);
    }

    var ironDepositPoints = genPoints(map, settings.ironDepositCount, whiteCastle, blackCastle);
    for (var i = 0; i < ironDepositPoints.length; i++) {
        map.addIronDeposit(ironDepositPoints[i]);
    }

    var stoneDepositPoints = genPoints(map, settings.stoneDepositCount, whiteCastle, blackCastle);
    for (var i = 0; i < stoneDepositPoints.length; i++) {
        map.addStoneDeposit(stoneDepositPoints[i]);
    }

    var waterPoints = genPoints(map, settings.waterCount, whiteCastle, blackCastle);
    for (var i = 0; i < waterPoints.length; i++) {
        map.addWater(waterPoints[i]);
    }


    /*
    var bearPoints = genPoints(map, settings.bearCount, whiteCastle, blackCastle);
    for (var i = 0; i < bearPoints.length; i++) {
        var color = utils.NEUTRAL;
        var bear = new Bear(bearPoints[i], color);
        map.initialTroops.push(bear);
    }
    */


    map.whiteCastle = whiteCastle;
    map.blackCastle = blackCastle;

    addRandomUnits(map);

    return map;
}


addRandomUnits = function (map) {
    var workers = 10;
    var priests = 0;
    var mountedPriests = 0;
    var swordsmen = 0;
    var spearmen = 0;
    var horsemen = 0;
    var knights = 0;
    var catapults = 0;
    var archers = 0;

    var barracks = 0;
    var churches = 0;
    var farms = 4;
    var houses = 0;
    var isEnemy = false;

    for (var i = 0; i < workers; i++) {

        var pointForWorkerWhite = getPointForUnit(map, 1);
        var workerWhite = new Worker(pointForWorkerWhite, utils.WHITE);
        map.initialTroops.push(workerWhite);


        if (isEnemy) {
            var pointForWorkerBlack = getPointForUnit(map, 1);
            var workerBlack = new Worker(pointForWorkerBlack, utils.BLACK);
            map.initialTroops.push(workerBlack);
        }
    }

    for (var i = 0; i < priests; i++) {
        var pointForPriestWhite = getPointForUnit(map, 1);
        var priestWhite = new Priest(pointForPriestWhite, utils.WHITE);
        map.initialTroops.push(priestWhite);

        if (isEnemy) {
            var pointForPriestBlack = getPointForUnit(map, 1);
            var priestBlack = new Priest(pointForPriestBlack, utils.BLACK);
            map.initialTroops.push(priestBlack);
        }
    }


    for (var i = 0; i < mountedPriests; i++) {

        var pointForMountedPriestWhite = getPointForUnit(map, 1);
        var mountedPriestWhite = new MountedPriest(pointForMountedPriestWhite, utils.WHITE);
        map.initialTroops.push(mountedPriestWhite);

        if (isEnemy) {
            var pointForMountedPriestBlack = getPointForUnit(map, 1);
            var mountedPriestBlack = new MountedPriest(pointForMountedPriestBlack, utils.BLACK);
            map.initialTroops.push(mountedPriestBlack);
        }
    }

    for (var i = 0; i < swordsmen; i++) {

        var pointForSwordsmanWhite = getPointForUnit(map, 1);
        var swordsmanWhite = new Swordsman(pointForSwordsmanWhite, utils.WHITE);
        map.initialTroops.push(swordsmanWhite);

        if (isEnemy) {

            var pointForSwordsmanBlack = getPointForUnit(map, 1);
            var swordsmanBlack = new Swordsman(pointForSwordsmanBlack, utils.BLACK);
            map.initialTroops.push(swordsmanBlack);
        }
    }


    for (var i = 0; i < spearmen; i++) {

        var pointForSpearmanWhite = getPointForUnit(map, 1);
        var spearmanWhite = new Spearman(pointForSpearmanWhite, utils.WHITE);
        map.initialTroops.push(spearmanWhite);

        if (isEnemy) {

            var pointForSpearmanBlack = getPointForUnit(map, 1);
            var spearmanBlack = new Spearman(pointForSpearmanBlack, utils.BLACK);
            map.initialTroops.push(spearmanBlack);
        }
    }


    for (var i = 0; i < horsemen; i++) {

        var pointForHorsemanWhite = getPointForUnit(map, 1);
        var horsemanWhite = new Horseman(pointForHorsemanWhite, utils.WHITE);
        map.initialTroops.push(horsemanWhite);

        if (isEnemy) {

            var pointForHorsemanBlack = getPointForUnit(map, 1);
            var horsemanBlack = new Horseman(pointForHorsemanBlack, utils.BLACK);
            map.initialTroops.push(horsemanBlack);
        }
    }


    for (var i = 0; i < knights; i++) {

        var pointForKnightWhite = getPointForUnit(map, 1);
        var knightWhite = new Knight(pointForKnightWhite, utils.WHITE);
        map.initialTroops.push(knightWhite);


        if (isEnemy) {

            var pointForKnightBlack = getPointForUnit(map, 1);
            var knightBlack = new Knight(pointForKnightBlack, utils.BLACK);
            map.initialTroops.push(knightBlack);
        }
    }


    for (var i = 0; i < archers; i++) {

        var pointForArcherWhite = getPointForUnit(map, 1);
        var archerWhite = new Archer(pointForArcherWhite, utils.WHITE);
        map.initialTroops.push(archerWhite);

        if (isEnemy) {

            var pointForArcherBlack = getPointForUnit(map, 1);
            var archerBlack = new Archer(pointForArcherBlack, utils.WHITE);
            map.initialTroops.push(archerBlack);
        }
    }


    for (var i = 0; i < catapults; i++) {
        var pointForCatapultWhite = getPointForUnit(map, 1);
        var catapultWhite = new Catapult(pointForCatapultWhite, utils.WHITE);
        map.initialTroops.push(catapultWhite);

        if (isEnemy) {

            var pointForCatapultBlack = getPointForUnit(map, 1);
            var catapultBlack = new Catapult(pointForCatapultBlack, utils.BLACK);
            map.initialTroops.push(catapultBlack);
        }
    }


    for (var i = 0; i < barracks; i++) {
        var pointForBarrackWhite = getPointForUnit(map, 5);
        var barrackWhite = new Barrack(pointForBarrackWhite, utils.WHITE);
        map.initialTroops.push(barrackWhite);

        if (isEnemy) {
            var pointForBarrackBlack = getPointForUnit(map, 5);
            var barrackBlack = new Barrack(pointForBarrackBlack, utils.BLACK);
            map.initialTroops.push(barrackBlack);
        }
    }

    for (var i = 0; i < churches; i++) {
        var pointForChurchWhite = getPointForUnit(map, 5);
        var churchWhite = new Church(pointForChurchWhite, utils.WHITE);
        map.initialTroops.push(churchWhite);

        if (isEnemy) {

            var pointForChurchBlack = getPointForUnit(map, 5);
            var churchBlack = new Church(pointForChurchBlack, utils.BLACK);
            map.initialTroops.push(churchBlack);
        }
    }


    for (var i = 0; i < farms; i++) {
        var pointForFarmWhite = getPointForUnit(map, 3);
        var farmWhite = new Farm(pointForFarmWhite, utils.WHITE);
        map.initialTroops.push(farmWhite);

        if (isEnemy) {
            var pointForFarmBlack = getPointForUnit(map, 3);
            var farmBlack = new Farm(pointForFarmBlack, utils.BLACK);
            map.initialTroops.push(farmBlack);
        }
    }


    for (var i = 0; i < houses; i++) {
        var pointForHouseWhite = getPointForUnit(map, 3);
        var houseWhite = new House(pointForHouseWhite, utils.WHITE);
        map.initialTroops.push(houseWhite);

        if (isEnemy) {
            var pointForHouseBlack = getPointForUnit(map, 3);
            var houseBlack = new House(pointForHouseBlack, utils.BLACK);
            map.initialTroops.push(houseBlack);
        }
    }


    for (var i = 0; i < map.landscapeStoneDeposits.length; i++) {
        var color;
        if (Math.random() <= 0.5) {
            color = utils.WHITE;
        }
        else {
            color = utils.BLACK;
        }

        var mine = new Quarry(map.landscapeStoneDeposits[i], color);
        map.initialTroops.push(mine);
    }


    for (var i = 0; i < map.landscapeIronDeposits.length; i++) {
        var color;
        if (Math.random() <= 0.5) {
            color = utils.WHITE;
        }
        else {
            color = utils.BLACK;
        }

        var mine = new IronMine(map.landscapeIronDeposits[i], color);
        map.initialTroops.push(mine);
    }
}


getPointForUnit = function (map, size) {
    while (true) {
        var x = Math.round(Math.random() * (map.width - 1 - size));
        var y = Math.round(Math.random() * (map.height - 1 - size));

        var canPlace = true;
        for (var i = 0; i < size; i++) {
            if(!canPlace){
                break;
            }
            for (var j = 0; j < size; j++) {
                if (!map.empty[i][j]) {
                    canPlace = false;
                    break;
                }
            }
        }

        if (canPlace) {
            var inTroops = map.initialTroops;
            var good = true;

            var pos = new utils.Point(x + Math.floor(size / 2), y + Math.floor(size / 2));

            for (var i = 0; i < inTroops.length; i++) {
                var troop = inTroops[i];

                var inTroopSize = 1;
                if (inTroops[i].size !== undefined) {
                    inTroopSize = inTroops[i].size;
                }

                var neededD = Math.floor(size / 2) + Math.floor(inTroopSize / 2);

                var c1 = Math.abs(troop.position.x - pos.x) <= neededD;
                var c2 = Math.abs(troop.position.y - pos.y) <= neededD;


                if (c1 && c2) {
                    good = false;
                    console.log("Can't place (" + pos.x + ":" + pos.y + ")" + size + " " + troop.type + " (" + troop.position.x+":"+troop.position.y+")");
                    break;
                }
            }
            if (good) {
                return pos;
            }
        }
        else{
            console.log("Can't place " + size);
        }
    }
}


surplus = function (distance) {
    return 1.0 / (distance + 5.0);
};


getBalance = function (map) {
    var ironPoints = [0, 0];
    var stonePoints = [0, 0];
    var foodPoints = [0, 0];


    for (var i = 0; i < map.landscapeStoneDeposits.length; i++) {
        stonePoints[0] += surplus(utils.dist(map.landscapeStoneDeposits[i], map.initialWhiteKingPosition));
        stonePoints[1] += surplus(utils.dist(map.landscapeStoneDeposits[i], map.initialBlackKingPosition));
    }

    for (var i = 0; i < map.landscapeIronDeposits.length; i++) {
        ironPoints[0] += surplus(utils.dist(map.landscapeIronDeposits[i], map.initialWhiteKingPosition));
        ironPoints[1] += surplus(utils.dist(map.landscapeIronDeposits[i], map.initialBlackKingPosition));
    }

    for (var i = 0; i < map.landscapeWater.length; i++) {
        foodPoints[0] += 4 * surplus(utils.dist(map.landscapeWater[i], map.initialWhiteKingPosition));
        foodPoints[1] += 4 * surplus(utils.dist(map.landscapeWater[i], map.initialBlackKingPosition));
    }

    var points1 = ironPoints[0] * Math.pow(foodPoints[0], 1.5) * Math.pow(stonePoints[0], 0.7);
    var points2 = ironPoints[1] * Math.pow(foodPoints[1], 1.5) * Math.pow(stonePoints[1], 0.7);

    var res = Math.abs((points1 - points2));


    if (points1 < 0.01 || points2 < 0.01) {
        res += 0.05;
    }

    return res;
}

generate = function (settings) {
    tries = 1;
    bestBalance = null;
    bestMap = null;
    for (var i = 0; i < tries; i++) {
        var generatedMap = tryGenerate(settings);
        var balance = getBalance(generatedMap);
        console.log(balance * 1000);
        if (bestBalance === null || balance < bestBalance) {
            bestBalance = balance;
            bestMap = generatedMap;
        }
    }

    console.log("BB = ", bestBalance * 1000);
    return bestMap;
}

module.exports.generate = generate;
module.exports.MAP_SETTINGS_VALUES = MapSettings.MAP_SETTINGS_VALUES;