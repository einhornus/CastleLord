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


var width = 7;
var height = 9;
var map = new Map(width, height);
map.initialWhiteKingPosition = new utils.Point(0, Math.floor(height/2));
map.initialBlackKingPosition = new utils.Point(width-1, Math.floor(height/2));

let gate1 = new Gate(new utils.Point(0, 4), new utils.Point(0, 5));
map.whiteCastle.addGate(gate1);

let gate2 = new Gate(new utils.Point(0, 4), new utils.Point(0, 3));
map.blackCastle.addGate(gate2);


let peasant = new Peasant(new utils.Point(3, 4), utils.BLACK);
map.initialTroops.push(peasant);


let game = new Game(map);
let whiteKing = game.whiteKing;
let blackKing = game.blackKing;

drawer.printGame(game);

let moves = game.genMovesForCurrentUnit();
console.log(moves);

game.assignMove(moves[0]);

drawer.printGame(game);
