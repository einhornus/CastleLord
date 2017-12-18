utils = require("./../lib/core/utils");
drawer = require("./../lib/core/drawer");
Tower = require("./../lib/core/castle/Tower");
Gate = require("./../lib/core/castle/Gate");
Wall = require("./../lib/core/castle/Wall");
King = require("../lib/core/unit/combatant/Lord");
Peasant = require("../lib/core/unit/combatant/Worker");
Builder = require("../lib/core/unit/combatant/Worker");
GoldMine = require("../lib/core/unit/building/House");
Barrack = require("../lib/core/unit/building/Barrack");
Archer = require("../lib/core/unit/combatant/Archer");
StoneMine = require("../lib/core/unit/building/IronMine");
Move = require("./../lib/core/move/Move");
IdleMove = require("./../lib/core/move/IdleMove");
BuildingMove = require("./../lib/core/move/BuildingMove");
RelocationMove = require("./../lib/core/move/RelocationMove");
ShootingMove = require("./../lib/core/move/ShootingMove");
Game = require("./../lib/core/Game.js");
IncomeMove = require("./../lib/core/move/IncomeMove");
Map = require("./../lib/core/map/Map");
AI = require("./../server/AI/AI");

var query = require('cli-interact').getInteger;


var map = new Map(4, 4);
var whiteBuilder = new Builder(new utils.Point(1, 0), utils.WHITE);
var blackBuilder = new Builder(new utils.Point(map.width - 1, map.height - 2), utils.BLACK);
map.initialTroops.push(whiteBuilder);
map.initialTroops.push(blackBuilder);
var game = new Game(map);

stop = false;
while (true) {
    if (stop) {
        continue;
    }

    if (game.getCurrentUnit().color === utils.WHITE) {
        console.log("Your move");
        drawer.printGame(game);
        var moves = game.genMovesForCurrentUnit();
        for (var i = 0; i < moves.length; i++) {
            console.log(i, moves[i]);
        }

        var index = query();
        console.log(index);
        var move = moves[index];
        console.log("Move ", move, "assigned by you");
        stop = false;
        game.assignMove(move);
    }
    else {
        console.log("Computer move");
        drawer.printGame(game);
        var move = AI.move(game);
        console.log("Move ", move, "assigned by computer")
        game.assignMove(move);
    }
}


