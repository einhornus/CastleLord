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
            return {x: obj.x + this.centerX, y: obj.y + this.centerY};;
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
        res.push(this.getPoint({x: -this.getWidthX()+1, y: -this.getWidthY()+1}));
        res.push(this.getPoint({x: this.getWidthX()-1, y: -this.getWidthY()+1}));
        res.push(this.getPoint({x: this.getWidthX()-1, y: this.getWidthY()-1}));
        res.push(this.getPoint({x: -this.getWidthX()+1, y: this.getWidthY()-1}));
        return res
    }

    getWalls() {
        var res = [];
        for (var i = -this.getWidthX(); i <= this.getWidthX(); i++) {
            if(i !== 0) {
                var x = i;
                var y1 = -this.getWidthY();
                var y2 = this.getWidthY();

                var wall1 = this.getPoint({x: x, y: y1})
                var wall2 = this.getPoint({x: x, y: y2})

                res.push(wall1);
                res.push(wall2);
            }
        }

        for (var i = -this.getWidthY()+1; i <= this.getWidthY()-1; i++) {
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

var MAP_SETTINGS_VALUES = {
    SIZE: {
        NORMAL: 1
    },

    CASTLE_SIZE: {
        NORMAL: 1
    },

    INITIAL_TROOPS: {
        NORMAL: 1
    },

    INITIAL_RESOURCES: {
        NORMAL: 1
    }
}


class MapSettings {
    constructor(size, initialTroops, initialResources, castleSize) {
        if (size === MAP_SETTINGS_VALUES.SIZE.NORMAL) {
            this.sizeX = 84;
            this.sizeY = 48;
        }

        if (initialTroops === MAP_SETTINGS_VALUES.INITIAL_TROOPS.NORMAL) {
            this.archers = 2;
        }

        if (initialResources === MAP_SETTINGS_VALUES.INITIAL_RESOURCES.NORMAL) {
            this.initialFood = 200;
            this.initialGold = 500;
            this.initialStone = 500;
            this.initialIron = 500;
        }

        if (castleSize === MAP_SETTINGS_VALUES.CASTLE_SIZE.NORMAL) {
            this.castleSizeX = 20;
            this.castleSizeY = 15;
        }

        this.forestFrequencyMean = 0.01;
        this.forestFrequencyDerivation = 0.003;
        this.forestSizeMean = 4;
        this.forestSizeDerivation = 2;
        this.forestDistanceMean = 2;
        this.forestDistanceDerivation = 1;

        this.goldDepositFrequency = 0.000;
        this.ironDepositFrequency = 0.001;
        this.stoneDepositFrequency = 0.001;
        this.waterFrequency = 0.001;
        this.bearFrequency = 0.005;

    }
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


genPoints = function (map, frequency, whiteCastle, blackCastle) {
    var res = [];
    for (var i = 0; i < map.width; i++) {
        for (var j = 0; j < map.height; j++) {
            var point = new utils.Point(i, j);
            if (Math.random() < frequency) {
                if (map.isEmpty(point)) {
                    if (!whiteCastle.isInsideCastle(i, j) && !blackCastle.isInsideCastle(i, j)) {
                        res.push(point);
                    }
                }
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
    var forestCount = Math.round(getGaussianNumber(settings.forestFrequencyMean, settings.forestFrequencyDerivation) * map.width * map.height);

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


    var whiteWorker = new Worker(new utils.Point(map.initialWhiteKingPosition.x + 1, map.initialWhiteKingPosition.y), utils.WHITE);
    var blackWorker = new Worker(new utils.Point(map.initialBlackKingPosition.x + 1, map.initialBlackKingPosition.y), utils.BLACK);

    //var whiteArcher = new Archer(new utils.Point(map.initialBlackKingPosition.x + 3, map.initialBlackKingPosition.y), utils.WHITE);
    //var whiteCatapult = new Catapult(new utils.Point(map.initialBlackKingPosition.x + 2, map.initialBlackKingPosition.y), utils.WHITE);
    //var blackBarrack = new Barrack(new utils.Point(map.initialBlackKingPosition.x + 5, map.initialBlackKingPosition.y), utils.BLACK);


    //map.initialTroops.push(whiteArcher);
    //map.initialTroops.push(whiteCatapult);
    //map.initialTroops.push(blackBarrack);


    var whiteArcher = new Archer(new utils.Point(map.initialWhiteKingPosition.x - 1 , map.initialWhiteKingPosition.y - 1), utils.WHITE);

    map.addWater(new utils.Point(map.initialWhiteKingPosition.x + 15, map.initialWhiteKingPosition.y + 15))

    var whiteFarm = new Farm(new utils.Point(map.initialWhiteKingPosition.x + 13, map.initialWhiteKingPosition.y + 13), utils.WHITE);
    var whiteBarracks = new Barrack(new utils.Point(map.initialWhiteKingPosition.x + 3, map.initialWhiteKingPosition.y + 3), utils.WHITE);
    var whiteChurch = new Church(new utils.Point(map.initialWhiteKingPosition.x - 1, map.initialWhiteKingPosition.y + 5), utils.WHITE);
    var whiteWorker = new Worker(new utils.Point(map.initialWhiteKingPosition.x - 5, map.initialWhiteKingPosition.y - 5), utils.WHITE);
    var blackCatapult = new Catapult(new utils.Point(map.initialWhiteKingPosition.x + 3, map.initialWhiteKingPosition.y + 0), utils.WHITE);
    var whiteHouse = new House(new utils.Point(map.initialWhiteKingPosition.x - 3, map.initialWhiteKingPosition.y - 3), utils.WHITE);
    var whitePriest = new Priest(new utils.Point(map.initialWhiteKingPosition.x - 4, map.initialWhiteKingPosition.y - 4), utils.WHITE);
    var blackSpearman = new Spearman(new utils.Point(map.initialWhiteKingPosition.x - 0, map.initialWhiteKingPosition.y + 2), utils.BLACK);

    whiteWorker.health = 80;

    //var bear = new Bear(new utils.Point(map.initialWhiteKingPosition.x - 2, map.initialWhiteKingPosition.y - 4), utils.NEUTRAL);
    //map.initialTroops.push(bear);

    //map.initialTroops.push(whiteWorker);
    //map.initialTroops.push(blackCatapult);
    //smap.initialTroops.push(whiteFarm);

    var tower = new Tower(whiteArcher.position, utils.WHITE);
    //map.initialTroops.push(tower);


    //map.initialTroops.push(whiteArcher);
    //map.initialTroops.push(whiteBarracks);
    map.initialTroops.push(blackSpearman);

    map.initialTroops.push(whiteChurch);
    map.initialTroops.push(whiteHouse);

    /*
    for (var i = 0; i < settings.archers; i++) {
        var posForWhiteArcher = whiteTowers[i];
        var posForBlackArcher = blackTowers[i];

        var whiteArcher = new Archer(new utils.Point(posForWhiteArcher.x, posForWhiteArcher.y), utils.WHITE);
        var blackArcher = new Archer(new utils.Point(posForBlackArcher.x, posForBlackArcher.y), utils.BLACK);

        map.initialTroops.push(whiteArcher);
        map.initialTroops.push(blackArcher);
    }
    */
    

    var goldDepositPoints = genPoints(map, settings.goldDepositFrequency, whiteCastle, blackCastle);
    for (var i = 0; i < goldDepositPoints.length; i++) {
        map.addGoldDeposit(goldDepositPoints[i]);
    }

    var ironDepositPoints = genPoints(map, settings.ironDepositFrequency, whiteCastle, blackCastle);
    for (var i = 0; i < ironDepositPoints.length; i++) {
        map.addIronDeposit(ironDepositPoints[i]);
    }

    var stoneDepositPoints = genPoints(map, settings.stoneDepositFrequency, whiteCastle, blackCastle);
    for (var i = 0; i < stoneDepositPoints.length; i++) {
        map.addStoneDeposit(stoneDepositPoints[i]);
    }

    var waterPoints = genPoints(map, settings.waterFrequency, whiteCastle, blackCastle);
    for (var i = 0; i < waterPoints.length; i++) {
        map.addWater(waterPoints[i]);
    }


    var bearPoints = genPoints(map, settings.bearFrequency, whiteCastle, blackCastle);
    for (var i = 0; i < bearPoints.length; i++) {
        //var color = Math.random()<0.5?utils.WHITE:utils.BLACK;
        var color = utils.NEUTRAL;
        var bear = new Bear(bearPoints[i], color);
        map.initialTroops.push(bear);
    }


    return map;
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


    if(points1 < 0.01 || points2 < 0.01){
        res += 0.05;
    }

    return res;
}

generate = function (settings) {
    tries = 100;
    bestBalance = null;
    bestMap = null;
    for (var i = 0; i < tries; i++) {
        var generatedMap = tryGenerate(settings);
        var balance = getBalance(generatedMap);
        console.log(balance*1000);
        if (bestBalance === null || balance < bestBalance) {
            bestBalance = balance;
            bestMap = generatedMap;
        }
    }

    console.log("BB = ", bestBalance*1000);
    return bestMap;
}

module.exports.generate = generate;
module.exports.MapSettings = MapSettings;
module.exports.MAP_SETTINGS_VALUES = MAP_SETTINGS_VALUES;