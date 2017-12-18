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


var shootingMoveTest = function() {
    var map = new Map(7, 9);
    let pos = new utils.Point(Math.floor(map.width/2), map.initialBlackKingPosition.y);
    map.initialTroops.push(new Archer(pos, utils.WHITE));

    let game = new Game(map);
    let whiteKing = game.whiteKing;
    let blackKing = game.blackKing;
    blackKing.health = 0.001;

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }


    drawer.printGame(game);
    let avMoves = game.genMovesForCurrentUnit();
    let found = false;
    for(var i = 0; i<avMoves.length; i++){
        let cmove = avMoves[i];
        let isGood = cmove instanceof ShootingMove;
        if(isGood){
            if(cmove.target.x === blackKing.position.x && cmove.target.y === blackKing.position.y){
                game.assignMove(cmove);
                found = true;
                break;
            }
        }
    }



    if(!found){
        throw new utils.Exception("Shooting move test failed 1");
    }

    if(game.units.length != 2){
        throw new utils.Exception("Shooting move test failed 2");
    }

    console.log("Shooting move test passed");

    drawer.printGame(game);

}

shootingMoveTest();
