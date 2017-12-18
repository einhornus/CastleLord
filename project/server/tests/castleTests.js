utils = require("./../../lib/core/utils");
drawer = require("./../../lib/core/drawer");
Tower = require("./../../lib/core/castle/Tower");
Gate = require("./../../lib/core/castle/Gate");
Wall = require("./../../lib/core/castle/Wall");
King = require("../../lib/core/unit/combatant/Lord");
Peasant = require("../../lib/core/unit/combatant/Worker");
Builder = require("../../lib/core/unit/combatant/Worker");
GoldMine = require("../../lib/core/unit/building/House");
Barrack = require("../../lib/core/unit/building/Barrack");
Archer = require("../../lib/core/unit/combatant/Archer");
StoneMine = require("../../lib/core/unit/building/IronMine");
Move = require("./../../lib/core/move/Move");
IdleMove = require("./../../lib/core/move/IdleMove");
BuildingMove = require("./../../lib/core/move/BuildingMove");
RelocationMove = require("./../../lib/core/move/RelocationMove");
ShootingMove = require("./../../lib/core/move/ShootingMove");
Game = require("./../../lib/core/Game.js");
IncomeMove = require("./../../lib/core/move/IncomeMove");
Map = require("./../../lib/core/map/Map");



var width = 3;
var height = 4;
var map = new Map(width, height);
var peasant = new Peasant(new utils.Point(1, 1), utils.WHITE);
map.initialTroops.push(peasant);
let wall1 = new Wall(new utils.Point(0, 0), new utils.Point(1, 0));
let wall2 = new Wall(new utils.Point(0, 0), new utils.Point(0, 1));
let gate1 = new Gate(new utils.Point(1, 1), new utils.Point(2, 1));
let gate2 = new Gate(new utils.Point(0, 2), new utils.Point(0, 3));
let tower = new Tower(new utils.Point(2, 2));

map.whiteCastle.addWall(wall1);
map.blackCastle.addWall(wall2);
map.whiteCastle.addGate(gate1);
map.blackCastle.addGate(gate2);
map.whiteCastle.addTower(tower);




var game = new Game(map);

if(game.canGoThroughCastle(wall1.point2, wall1.point1, utils.WHITE)){
    throw new utils.Exception("The wall is impassable");
}

if(game.canGoThroughCastle(wall1.point2, wall1.point1, utils.BLACK)){
    throw new utils.Exception("The wall is impassable");
}

if(game.canGoThroughCastle(wall2.point2, wall2.point1, utils.WHITE)){
    throw new utils.Exception("The wall is impassable");
}

if(game.canGoThroughCastle(wall2.point1, wall2.point2, utils.BLACK)){
    throw new utils.Exception("The wall is impassable");
}

if(!game.canGoThroughCastle(gate1.point1, gate1.point2, utils.WHITE)){
    throw new utils.Exception("The gate is passable");
}

if(game.canGoThroughCastle(gate1.point2, gate1.point1, utils.BLACK)){
    throw new utils.Exception("The gate is impassable");
}


if(game.canGoThroughCastle(gate2.point1, gate2.point2, utils.WHITE)){
    throw new utils.Exception("The gate is impassable");
}

if(!game.canGoThroughCastle(gate2.point2, gate2.point1, utils.BLACK)){
    throw new utils.Exception("The gate is passable");
}


drawer.printGame(game);



map.whiteCastle.destroyWall(wall1);
map.blackCastle.destroyGate(gate2);
map.whiteCastle.destroyTower(tower);



drawer.printGame(game);


if(!game.canGoThroughCastle(wall1.point2, wall1.point1, utils.WHITE)){
    throw new utils.Exception("Passable");
}

if(!game.canGoThroughCastle(wall1.point2, wall1.point1, utils.BLACK)){
    throw new utils.Exception("Passable");
}


if(!game.canGoThroughCastle(gate2.point1, gate2.point2, utils.WHITE)){
    throw new utils.Exception("Passable");
}

if(map.whiteCastle.walls.length !== 0){
    throw new utils.Exception("Should be 0 walls");
}


if(map.blackCastle.walls.length !== 1){
    throw new utils.Exception("Should be 1 walls");
}


if(map.blackCastle.gates.length !== 0){
    throw new utils.Exception("Should be 0 gates");
}


if(map.whiteCastle.gates.length !== 1){
    throw new utils.Exception("Should be 1 gate");
}



if(map.whiteCastle.towers.length !== 0){
    throw new utils.Exception("Should be 0 towers");
}
