class Exception {
    constructor(message) {
        this.message = message;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    hash() {
        return this.x * 1000000 + this.y;
    }
}

var WIDTH = 9;
var HEIGHT = 7;

var WHITE = 0;
var BLACK = 1;

var CAMP_WIDTH = 3;

var GOLD_MINE_PLUS = 5;
var STONE_MINE_PLUS = 2;

var ARCHER_SHOOTING_RANGE = 4;
var ARCHER_MOVING_RANGE = 2;

var ALL_DIRECTIONS = [[1, 0],
    [1, -1],
    [1, 1],
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1]
];

var STRAIGHT_DIRECTIONS = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
];

var DIAGONAL_DIRECTIONS = [
    [1, -1],
    [1, 1],
    [-1, 1],
    [-1, -1],
];

var isPointValid = function (point) {
    if (point.x < 0 || point.x >= WIDTH) {
        return false;
    }

    if (point.y < 0 || point.y >= HEIGHT) {
        return false;
    }

    return true;
};

var areArraysEqual = function (array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }

    let hashes1 = [];
    let hashes2 = [];
    for (let i = 0; i < array1.length; i++) {
        hashes1.push(array1[i].hash());
        hashes2.push(array2[i].hash());
    }

    let set1 = new Set(hashes1);
    let set2 = new Set(hashes2);

    if (set1.size !== set2.size) {
        return false;
    }

    for (let item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }

    return true;
}


module.exports.Exception = Exception;
module.exports.WIDTH = WIDTH;
module.exports.HEIGHT = HEIGHT;
module.exports.Point = Point;
module.exports.isPointValid = isPointValid;
module.exports.WHITE = WHITE;
module.exports.BLACK = BLACK;
module.exports.CAMP_WIDTH = CAMP_WIDTH;
module.exports.areArraysEqual = areArraysEqual;
module.exports.GOLD_MINE_PLUS = GOLD_MINE_PLUS;
module.exports.STONE_MINE_PLUS = STONE_MINE_PLUS;
module.exports.ARCHER_SHOOTING_RANGE = ARCHER_SHOOTING_RANGE;
module.exports.ARCHER_MOVING_RANGE = ARCHER_MOVING_RANGE;
module.exports.ALL_DIRECTIONS = ALL_DIRECTIONS;
module.exports.STRAIGHT_DIRECTIONS = STRAIGHT_DIRECTIONS;
module.exports.DIAGONAL_DIRECTIONS = DIAGONAL_DIRECTIONS;

