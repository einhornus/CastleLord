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


var dist = function(a, b){
    return Math.sqrt((a.x - b.x)*(a.x - b.x) + (a.y - b.y)*(a.y - b.y));
}

var WHITE = 0;
var BLACK = 1;
var NEUTRAL = 2;


var GOLD_MINE_PLUS = 5;
var STONE_MINE_PLUS = 2;

var ALL_DIRECTIONS = [
    [1, 0],
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

var isPointValid = function (point, map) {
    if (point.x < 0 || point.x >= map.width) {
        return false;
    }

    if (point.y < 0 || point.y >= map.height) {
        return false;
    }

    if(map.passable[Math.round(point.x)][Math.round(point.y)]){
        return true;
    }
    else {
        return true;
    }
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

var create2DArray = function(width, height, initialValue){
    var x = [];
    for (var i = 0; i < width; i++) {
        var y = [];
        for(var j = 0; j<height; j++){
            y.push(initialValue);
        }
        x.push(y);
    }
    return x;
}

var create2DArrayOfLists = function(width, height){
    var x = [];
    for (var i = 0; i < width; i++) {
        var y = [];
        for(var j = 0; j<height; j++){
            y.push([]);
        }
        x.push(y);
    }
    return x;
}



var GAME_PARAMS = {
    DAMAGE_MODIFIER : 1.0,
    HEAL_VOLUME : 50,
    TOWER_HEIGHT : 3.0,
    TREE_HEIGHT : 4.0,
    SIGHT_RADIUS : 15,

    FARM_DIST_K : 0.02,
    WELL_K : 0.8,

    RANGE:{
        K : 0.01,
        HEIGHT: 1.3333,
    },

    INCOME:{
        FARM:100,
        MINE:150,
        HOUSE:150,
        QUARRY:100
    },

    PRICE:{
        WORKER:{
            GOLD:70,
            IRON:30
        },

        SWORDSMAN:{
            GOLD:75,
            IRON:75
        },

        SPEARMAN:{
            GOLD:75,
            IRON:75
        },

        ARCHER:{
            GOLD:150
        },

        HORSEMAN:{
            GOLD:125,
            IRON:75
        },

        KNIGHT:{
            GOLD:150,
            IRON:200
        },

        CATAPULT:{
            GOLD:200,
            IRON:0
        },

        PRIEST:{
            GOLD:150,
            IRON:30
        },

        MOUNTED_PRIEST:{
            GOLD:250,
            IRON:30
        },

        FARM:{
            GOLD:150
        },

        MINE:{
            GOLD:150
        },

        BARRACKS:{
            GOLD:100,
            STONE:300
        },

        CHURCH:{
            GOLD:100,
            STONE:100
        },

        TOWER:{
            STONE:300
        },

        WALL:{
            STONE:50
        },

        HOUSE:{
            GOLD:250
        }
    },

    WEAPON:{
        HAMMER:0,
        SPEAR:1,
        SWORD:2,
        BOW:3,
        STONES:4,
        BEAR:5
    },

    ARMOUR:{
        NOTHING:0,
        SHIELD:1,
        HORSE:2,
        PLATE:3,
        WOOD_BUILDING:4,
        STONE_BUILDING:5,
        CATAPULT : 6,
        BEAR : 7
    },

    MORALE:{
        LOWEST : 0,
        VERY_LOW : 1,
        LOW : 2,
        NORMAL : 3,
        HIGH : 4,
        VERY_HIGH : 5,
        HIGHEST : 6
    },

    FOOD_CONSUMPTION:{
        SWORDSMAN:15,
        SPEARMAN:15,
        ARCHER:12,
        WORKER:10,
        PRIEST:10,
        MOUNTED_PRIEST:10,
        HORSEMAN:15,
        KNIGHT:21,
        HOUSE:30
    },

    MORALE_FOOD_ENOUGH : 10,
    MORALE_FOOD_NOT_ENOUGH : -30,
    MORALE_PRIEST_NEARBY_K : +100,
    MORALE_PRIEST_NEARBY_O : +5,
    MORALE_WOUNDED_K : -0.3,
}


getSpeed = function(armour, morale){
    if(armour === GAME_PARAMS.ARMOUR.BEAR){
        return 8;
    }

    if(armour === GAME_PARAMS.ARMOUR.CATAPULT){
        return 7;
    }

    if(armour === GAME_PARAMS.ARMOUR.STONE_BUILDING){
        return 0;
    }

    if(armour === GAME_PARAMS.ARMOUR.WOOD_BUILDING){
        return 0;
    }

    var speedTable = [
        [4, 5, 6, 7, 8, 9, 10],
        [3, 4, 5, 6, 7, 8, 9],
        [9, 9, 10, 10, 11, 12, 13],
        [2, 2, 3, 3, 4, 5, 6],
    ];

    var res = speedTable[armour][morale]
    return res;
}

getMoraleAttackModifier = function(morale){
    var table = [70, 80, 90, 100, 110, 120, 130];
    return table[morale];
}

getMoraleDefenceModifier = function(morale){
    var table = [50, 70, 90, 100, 110, 130, 150];
    return table[morale]
}

getMorale = function(moraleValue){
    if(moraleValue < -25){
        return GAME_PARAMS.MORALE.LOWEST;
    }

    if(moraleValue >= -25 && moraleValue < -15){
        return GAME_PARAMS.MORALE.VERY_LOW;
    }

    if(moraleValue >= -15 && moraleValue < -5){
        return GAME_PARAMS.MORALE.LOW;
    }

    if(moraleValue >= -5 && moraleValue < +5){
        return GAME_PARAMS.MORALE.NORMAL;
    }

    if(moraleValue >= +5 && moraleValue < +15){
        return GAME_PARAMS.MORALE.HIGH;
    }

    if(moraleValue >= +15 && moraleValue < 25){
        return GAME_PARAMS.MORALE.VERY_HIGH;
    }

    if(moraleValue >= +25){
        return GAME_PARAMS.MORALE.HIGHEST;
    }
}


areAdjacent = function(point1, point2){
    if(point1.x === point2.x && Math.abs(point1.y - point2.y) === 1){
        return true;
    }

    if(point1.y === point2.y && Math.abs(point1.x - point2.x) === 1){
        return true;
    }

    return false;
}

getDamage = function(weapon, armour){
    var table = [
        [100,  35,  50,  25,  50, 0, 100, 50],
        [200,  50, 200,  35,  50, 0, 100, 100],
        [150,  75,  75,  50,  50, 0, 100, 100],
        [300, 100, 150,  50,  0,  0,  35, 100],
        [  0,   0,   0,   0,  200, 150,   0, 100],
        [200, 200, 200,  200,  0,  0,  200, 100],
    ]

    return table[weapon][armour];
}

var RANDOM_STRING_LENGTH = 10;

function genRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < RANDOM_STRING_LENGTH; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

concatMoves = function(moves1, moves2){
    res = [];
    for(var i = 0; i<moves1.length; i++){
        res.push(moves1[i]);
    }

    for(var i = 0; i<moves2.length; i++){
        res.push(moves2[i]);
    }

    return res;
}


function clone(obj){
    //in case of premitives
    if(obj===null || typeof obj !== "object"){
        return obj;
    }

    //date objects should be
    if(obj instanceof Date){
        return new Date(obj.getTime());
    }

    //handle Array
    if(Array.isArray(obj)){
        var clonedArr = [];
        obj.forEach(function(element){
            clonedArr.push(clone(element))
        });
        return clonedArr;
    }

    //lastly, handle objects
    let clonedObj = new obj.constructor();
    for(var prop in obj){
        if(obj.hasOwnProperty(prop)){
            clonedObj[prop] = clone(obj[prop]);
        }
    }
    return clonedObj;
}

module.exports.Exception = Exception;
module.exports.Point = Point;
module.exports.isPointValid = isPointValid;
module.exports.WHITE = WHITE;
module.exports.BLACK = BLACK;
module.exports.NEUTRAL = NEUTRAL;
module.exports.areArraysEqual = areArraysEqual;
module.exports.GOLD_MINE_PLUS = GOLD_MINE_PLUS;
module.exports.STONE_MINE_PLUS = STONE_MINE_PLUS;
module.exports.ALL_DIRECTIONS = ALL_DIRECTIONS;
module.exports.STRAIGHT_DIRECTIONS = STRAIGHT_DIRECTIONS;
module.exports.DIAGONAL_DIRECTIONS = DIAGONAL_DIRECTIONS;
module.exports.create2DArray = create2DArray;
module.exports.create2DArrayOfLists = create2DArrayOfLists;
module.exports.GAME_PARAMS = GAME_PARAMS;
module.exports.getDamage = getDamage;
module.exports.getSpeed = getSpeed;
module.exports.dist = dist;
module.exports.genRandomString = genRandomString;
module.exports.areAdjacent = areAdjacent;
module.exports.getSpeed = getSpeed;
module.exports.getMorale = getMorale;
module.exports.getMoraleAttackModifier = getMoraleAttackModifier;
module.exports.getMoraleDefenceModifier = getMoraleDefenceModifier;
module.exports.concatMoves = concatMoves;
module.exports.clone = clone;




