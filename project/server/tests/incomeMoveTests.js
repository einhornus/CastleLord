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


var incomeMoveTests = function() {
    var map = new Map(7, 9);
    map.initialTroops.push(new GoldMine(new utils.Point(1, 5), utils.WHITE));
    map.initialTroops.push(new GoldMine(new utils.Point(2, 5), utils.WHITE));
    map.initialTroops.push(new StoneMine(new utils.Point(3, 5), utils.WHITE));
    map.initialTroops.push(new StoneMine(new utils.Point(4, 5), utils.BLACK));
    map.initialTroops.push(new GoldMine(new utils.Point(5, 5), utils.BLACK));
    let game = new Game(map);


    let expectedTable = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [utils.GOLD_MINE_PLUS, 0, 0, 0],
        [2*utils.GOLD_MINE_PLUS, 0, 0, 0],
        [2*utils.GOLD_MINE_PLUS, utils.STONE_MINE_PLUS, 0, 0],
        [2*utils.GOLD_MINE_PLUS, utils.STONE_MINE_PLUS, 0, utils.STONE_MINE_PLUS],
        [2*utils.GOLD_MINE_PLUS, utils.STONE_MINE_PLUS, utils.GOLD_MINE_PLUS, utils.STONE_MINE_PLUS],
    ];

    for(var i = 0; i<7; i++) {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);

        let whiteGold = game.whiteTreasury.gold;
        let blackGold = game.blackTreasury.gold;
        let whiteStone = game.whiteTreasury.stone;
        let blackStone = game.blackTreasury.stone;

        if(whiteGold === expectedTable[i][0] && whiteStone === expectedTable[i][1] && blackGold === expectedTable[i][2] && blackStone === expectedTable[i][3]){
        }
        else{
            throw new utils.Exception("Income move test failed " + (i+1));
        }
    }

    console.log("Income move test passed");
}

incomeMoveTests();
