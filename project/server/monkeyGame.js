utils = require("./../lib/core/utils");
drawer = require("./../lib/core/drawer");
Treasury = require("./../lib/core/Treasury");
King = require("../lib/core/unit/combatant/Lord");
Worker = require("../lib/core/unit/combatant/Worker");
Swordsman = require("../lib/core/unit/combatant/Swordsman");
GoldMine = require("../lib/core/unit/building/House");
Barrack = require("../lib/core/unit/building/Barrack");
YourMoveAction = require("./../lib/core/action/YourMoveAction");
Archer = require("../lib/core/unit/combatant/Archer");
StoneMine = require("../lib/core/unit/building/IronMine");
Move = require("./../lib/core/move/Move");
IdleMove = require("./../lib/core/move/IdleMove");
BuildingMove = require("./../lib/core/move/BuildingMove");
RelocationMove = require("./../lib/core/move/RelocationMove");
ShootingMove = require("./../lib/core/move/ShootingMove");
Game = require("./../lib/core/Game.js");
IncomeMove = require("./../lib/core/move/IncomeMove");
mapGenerator = require("./../lib/core/map/MapGenerator");
Map = require("./../lib/core/map/Map");
AI = require("./../server/AI/AI");



var size = mapGenerator.MAP_SETTINGS_VALUES.SIZE.NORMAL;
var initialTroops = mapGenerator.MAP_SETTINGS_VALUES.INITIAL_TROOPS.NORMAL;
var initialResources = mapGenerator.MAP_SETTINGS_VALUES.INITIAL_RESOURCES.NORMAL;
var castleSize = mapGenerator.MAP_SETTINGS_VALUES.CASTLE_SIZE.NORMAL;


var mapSettings = new mapGenerator.MapSettings(size, initialTroops, initialTroops, castleSize);
var map = mapGenerator.generate(mapSettings);
var game = new Game(map);




while(true){
    drawer.printGame(game);
    var move = AI.move(game);
    console.log("Move assigning ", move);
    var actions = game.assignMove(move);


    for(var i = 0; i<game.units.length; i++){
        game.units[i].setSightPoints(game);
        game.units[i].setRelocationPoints(game);
    }


    for(var i = 0; i<actions.length; i++){
        var action = actions[i];
        console.log(action);
    }
    console.log("Move assigned ");
}