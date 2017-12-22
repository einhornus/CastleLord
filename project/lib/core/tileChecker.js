utils = require("./utils");

var isTileOccupiedByBuilding = function(game, point){
    for(var i = 0; i<game.units.length; i++)
    {
        var unit = game.units[i];
        if(unit.isBuilding() && unit.type !== "Tower"){
            if(unit.isPointInsideBuilding(point)){
                return true;
            }
        }
    }
    return false;
}


var isTileOccupiedByTroop = function(game, point){
    for(var i = 0; i<game.units.length; i++)
    {
        var unit = game.units[i];
        if(!unit.isBuilding()){
            if(unit.position.hash() === point.hash()){
                return true;
            }
        }
    }
    return false;
}

var isTileOccupiedByUnit = function(game, point){
    return isTileOccupiedByBuilding(game, point) || isTileOccupiedByTroop(game, point);
}


var isTileEmpty = function(game, point){
    var v1 =  isTileOccupiedByUnit(game, point);
    var v2 = game.map.passable[point.x][point.y];
    return !v1 && v2;
}

var isTileOccupiedByTree = function(game, point){
    return game.map.trees[point.x][point.y];
}


var isTileOccupiedByWater = function(game, point){
    return game.map.water[point.x][point.y];
}


var isTilePassable = function(game, point){
    var v2 = game.map.passable[point.x][point.y];
    return v2;
}


module.exports.isTileOccupiedByBuilding = isTileOccupiedByBuilding;
module.exports.isTileOccupiedByTroop = isTileOccupiedByTroop;
module.exports.isTileOccupiedByUnit = isTileOccupiedByUnit;
module.exports.isTileEmpty = isTileEmpty;
module.exports.isTileOccupiedByTree = isTileOccupiedByTree;
module.exports.isTileOccupiedByWater = isTileOccupiedByWater;
module.exports.isTilePassable = isTilePassable;
