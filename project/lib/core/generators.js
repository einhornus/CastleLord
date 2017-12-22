utils = require("./utils");
Queue = require("./Queue");
tileChecker = require("./tileChecker");


var filterForValidCells = function (cells, map) {
    let res = [];
    for (var i = 0; i < cells.length; i++) {
        if (utils.isPointValid(cells[i], map)) {
            res.push(cells[i]);
        }
    }
    return res;
}

var filterForFriendlyUnits = function (cells, game, color) {
    let res = [];
    for (var i = 0; i < cells.length; i++) {
        let good = true;
        if (game.matrix[cells[i].x][cells[i].y] !== null) {
            if (game.matrix[cells[i].x][cells[i].y].color === color) {
                good = false;
            }
        }
        if (good) {
            res.push(cells[i]);
        }
    }
    return res;
}


var filterForDirectionObstacles = function (direction, game) {
    let res = [];
    let obstacles = 0;
    for (var i = 0; i < direction.length; i++) {
        if (game.matrix[direction[i].x][direction[i].y] !== null) {
            obstacles++;
            if (obstacles > 1) {
                break;
            }
        }

        res.push(direction[i]);
    }
    return res;
}

var generatePointsInDirections = function (position, directions, range, game, color, doIgnoreObstacles, doMakeIntermediateMoves) {
    let res = []
    for (let i = 0; i < directions.length; i++) {
        let direction = [];
        for (var j = 0; j < range; j++) {
            let point = new utils.Point(position.x + (j + 1) * directions[i][0], position.y + (j + 1) * directions[i][1])
            direction.push(point);
        }

        direction = filterForValidCells(direction, game.map);
        direction = filterForFriendlyUnits(direction, game, color);

        if (!doIgnoreObstacles) {
            direction = filterForDirectionObstacles(direction, game);
        }

        for (var j = 0; j < direction.length; j++) {
            if (!doMakeIntermediateMoves) {
                res.push(direction[j]);
            }
            else {
                let structure = {
                    end: direction[i],
                    inters: []
                }

                for (var k = 0; k < j; k++) {
                    structure.inters.push(direction[k]);
                }

                res.push(structure);
            }
        }
    }
    return res;
}


let DIRECTIONS = [[1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],

    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];


var getEmptyAdjacentCells = function (point, game) {
    var res = [];
    for (var i = 0; i < DIRECTIONS.length; i++) {
        var direction = DIRECTIONS[i];
        var newPoint = new utils.Point(point.x + direction[0], point.y + direction[1]);

        if (utils.isPointValid(newPoint, game.map)) {
            if (tileChecker.isTileEmpty(game, newPoint)) {
                res.push(newPoint);
            }
        }
    }
    return res;
}


var getPassableAdjacentCells = function (point, game) {
    var res = [];
    for (var i = 0; i < DIRECTIONS.length; i++) {
        var direction = DIRECTIONS[i];
        var newPoint = new utils.Point(point.x + direction[0], point.y + direction[1]);

        if (utils.isPointValid(newPoint, game.map)) {
            if (tileChecker.isTilePassable(game, point)) {
                res.push(newPoint);
            }
        }
    }
    return res;
}


var getEmptyAdjacentCellsWithGate = function (point, game, color) {
    var res = [];
    for (var i = 0; i < DIRECTIONS.length; i++) {
        var direction = DIRECTIONS[i];
        var newPoint = new utils.Point(point.x + direction[0], point.y + direction[1]);

        if (utils.isPointValid(newPoint, game.map)) {
            if (tileChecker.isTileEmpty(game, newPoint)) {
                res.push(newPoint);
            }
            else {
                var entity = game.matrix[newPoint.x][newPoint.y];
                if (entity !== null) {
                    if (entity.type === "Gate" && entity.color === color) {
                        res.push(newPoint);
                    }
                }
            }
        }
    }
    return res;
}

var generatePossibleMoves = function (unit, game) {
    let speed = unit.getSpeed();

    var queue = new Queue();
    queue.enqueue(unit.position);

    let res = utils.create2DArray(game.map.width, game.map.height, null);
    res[unit.position.x][unit.position.y] = {d: 0, path: []};

    while (true) {
        if (queue.isEmpty()) {
            break;
        }
        else {
            let top = queue.dequeue();
            let topData = res[top.x][top.y];

            if (res[top.x][top.y].d === speed) {

            }
            else {
                let adjacent = getEmptyAdjacentCellsWithGate(top, game, unit.color);
                for (var i = 0; i < adjacent.length; i++) {
                    let adjPoint = adjacent[i];
                    if (game.map.passable[adjPoint.x][adjPoint.y]) {
                        if (res[adjPoint.x][adjPoint.y] === null) {
                            let path = [];
                            for (var j = 0; j < topData.path.length; j++) {
                                path.push(topData.path[j]);
                            }
                            path.push(top);
                            res[adjPoint.x][adjPoint.y] = {d: topData.d + 1, path: path};
                            queue.enqueue(adjPoint);
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < game.map.width; i++) {
        for (var j = 0; j < game.map.height; j++) {
            if (!tileChecker.isTileEmpty(game, new utils.Point(i, j))) {
                res[i][j] = null;
            }
        }
    }

    return res;
}

var generatePossibleRangedPoints = function (unit, game, buildings) {
    var res = [];
    var sightPoints = generateSightPoints(unit, game);
    for(var i = 0; i<sightPoints.length; i++){
        if(sightPoints[i].hash() !== unit.position.hash()) {
            var point = sightPoints[i];
            var u = game.matrix[point.x][point.y];
            if (game.matrix[point.x][point.y] !== null) {
                if(u.size === undefined || u.size === 1) {
                    var nunit = game.matrix[point.x][point.y];
                    if (nunit.isBuilding() === buildings) {
                        if (!buildings && unit.color !== nunit.color) {

                        }
                        else {
                            res.push(point);
                        }
                    }
                }
            }

            if(buildings) {
                if (game.towers[point.x][point.y] !== null) {
                    res.push(point);
                }
            }
        }
    }

    if(buildings){
        for(var i = 0; i<game.units.length; i++){
            if(game.units[i].isBuilding()){
                if(game.units[i] !== undefined && game.units[i].size > 1){
                    var accept = false;
                    var buildingPoints = Unit.enumeratePointsInsideArea(game.units[i].position, game.units[i].size, game);
                    for(var j = 0; j<sightPoints.length; j++){
                        for(var k = 0; k<buildingPoints.length; k++){
                            if(buildingPoints[k].hash() === sightPoints[j].hash()){
                                accept = true;
                            }
                        }
                    }
                    if(accept){
                        res.push(game.units[i].position);
                    }
                }
            }
        }
    }

    return res;
}

var generateSightPoints = function(unit, game)
{
    var res = [];
    var obstacles = makeObstacles(game);
    for (var i = 0; i < game.map.width; i++) {
        for (var j = 0; j < game.map.height; j++) {
            var point = new utils.Point(i, j);
            var d = utils.dist(point, unit.position);
            if(d > utils.GAME_PARAMS.SIGHT_RADIUS || d === 0){
                continue;
            }
            if (canShoot(game, unit.position, point, game.hasTower(unit.position), game.hasTower(point), obstacles)) {
                res.push(point);
            }
        }
    }
    return res;
}


var makeObstacles = function (game) {
    var res = [];
    for (var i = 0; i < game.units.length; i++) {
        var unit = game.units[i];
        if (unit.isBuilding()) {
            var size = unit.size;
            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    var _x = x + unit.position.x - Math.floor(size / 2);
                    var _y = y + unit.position.y - Math.floor(size / 2);
                    var height = unit.height[x][y];
                    var obstacle = {x: _x, y: _y, height: height};
                    obstacle.whiteGate = false;
                    obstacle.blackGate = false;
                    if(unit.type === "Gate"){
                        if(unit.color === utils.WHITE){
                            obstacle.whiteGate = true;
                        }
                        if(unit.color === utils.BLACK){
                            obstacle.blackGate = true;
                        }
                    }
                    res.push(obstacle);
                }
            }
        }
        else {
            var obstacle = {x: unit.position.x, y: unit.position.y, height: 1.0};
            obstacle.whiteGate = false;
            obstacle.blackGate = false;
            res.push(obstacle);
        }
    }

    for (var i = 0; i < game.map.treesArray.length; i++) {
        var tree = game.map.treesArray[i]
        var obstacle = {x: tree.x, y: tree.y, height: utils.GAME_PARAMS.TREE_HEIGHT};
        obstacle.whiteGate = false;
        obstacle.blackGate = false;
        res.push(obstacle);
    }

    var depositPoints = [];
    for(var i = 0; i<game.map.landscapeWater.length; i++){
        depositPoints.push(game.map.landscapeWater[i]);
    }

    for(var i = 0; i<game.map.landscapeIronDeposits.length; i++){
        depositPoints.push(game.map.landscapeIronDeposits[i]);
    }

    for(var i = 0; i<game.map.landscapeStoneDeposits.length; i++){
        depositPoints.push(game.map.landscapeStoneDeposits[i]);
    }


    for(var i = 0; i<depositPoints.length; i++){
        var point = depositPoints[i];
        var obstacle = {x: point.x, y: point.y, height: 0, whiteGate:false, blackGate:false};
        res.push(obstacle);
    }

    return res;
}

var canShoot = function (game, from, to, fromTower, toTower, obstacles) {

    var myHeight = 0;
    var targetHeight = 0;

    if (fromTower) {
        myHeight += utils.GAME_PARAMS.TOWER_HEIGHT;
    }

    if (toTower) {
        targetHeight += utils.GAME_PARAMS.TOWER_HEIGHT;
    }

    var good = true;
    for (var i = 0; i < obstacles.length; i++) {
        var obs = obstacles[i];
        if (!canShootThroughObstacle(from, to, obs, myHeight, targetHeight)) {
            good = false;
            break;
        }
    }
    return good;

}

var canShootThroughObstacle = function (from, to, obstacle, myHeihgt, targetHeight) {
    if(obstacle.x === from.x && obstacle.y === from.y){
        return true;
    }

    if(obstacle.x === to.x && obstacle.y === to.y){
        return true;
    }


    var dbetween = Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2));
    var dist = Math.abs((to.y - from.y) * obstacle.x - (to.x - from.x) * obstacle.y + to.x * from.y - to.y * from.x);
    dist /= dbetween;

    var d1 = utils.dist(from, obstacle);
    var d2 = utils.dist(to, obstacle);

    if (dist >= 0.5) {
        return true;
    }
    else {
        if (d1 > dbetween) {
            return true;
        }

        if (d2 > dbetween) {
            return true;
        }

        var pos = d1 / dbetween;
        var heightOnObstacle = (1-pos) * myHeihgt + (pos) * targetHeight;
        if (heightOnObstacle >= obstacle.height) {
            return true;
        }
        else {
            return false;
        }
    }
}


module.exports.generatePointsInDirections = generatePointsInDirections;
module.exports.generatePossibleMoves = generatePossibleMoves;
module.exports.getEmptyAdjacentCells = getEmptyAdjacentCells;
module.exports.getPassableAdjacentCells = getPassableAdjacentCells;
module.exports.generatePossibleRangedPoints = generatePossibleRangedPoints;
module.exports.generateSightPoints = generateSightPoints;
module.exports.makeObstacles = makeObstacles;
