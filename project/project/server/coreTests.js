utils = require("./../lib/core/utils");
King = require("./../lib/core/unit/King");
Peasant = require("./../lib/core/unit/Peasant");
Builder = require("./../lib/core/unit/Builder");
GoldMine = require("./../lib/core/unit/GoldMine");
Barrack = require("./../lib/core/unit/Barrack");
Archer = require("./../lib/core/unit/Archer");
StoneMine = require("./../lib/core/unit/StoneMine");
Move = require("./../lib/core/move/Move");
IdleMove = require("./../lib/core/move/IdleMove");
BuildingMove = require("./../lib/core/move/BuildingMove");
RelocationMove = require("./../lib/core/move/RelocationMove");
ShootingMove = require("./../lib/core/move/ShootingMove");
Game = require("./../lib/core/Game.js");
IncomeMove = require("./../lib/core/move/IncomeMove");

var pointHash = function(point){
    return point.x*1000000+point.y;
}

var movingKingTest = function(){
    let game = new Game();


    let whitePeasant = new Peasant(new utils.Point(1, Math.floor(utils.HEIGHT/2)), utils.WHITE);
    let blackPeasant = new Peasant(new utils.Point(utils.WIDTH - 2, Math.floor(utils.HEIGHT/2)), utils.BLACK);
    game.placeUnit(whitePeasant);
    game.placeUnit(blackPeasant);


    let whiteBuilder1 = new Builder(new utils.Point(0, Math.floor(utils.HEIGHT/2)-1), utils.WHITE);
    let whiteBuilder2 = new Builder(new utils.Point(0, Math.floor(utils.HEIGHT/2)+1), utils.WHITE);

    let blackBuilder1 = new Builder(new utils.Point(utils.WIDTH - 1, Math.floor(utils.HEIGHT/2)-1), utils.BLACK);
    let blackBuilder2 = new Builder(new utils.Point(utils.WIDTH - 1, Math.floor(utils.HEIGHT/2)+1), utils.BLACK);

    game.placeUnit(whiteBuilder1);
    game.placeUnit(blackBuilder1);

    game.placeUnit(whiteBuilder2);
    game.placeUnit(blackBuilder2);


    let whiteKing = game.whiteKing;
    let blackKing = game.blackKing;
    game.placeUnit(new Peasant(new utils.Point(whiteKing.position.x + 1, whiteKing.position.y - 1), utils.BLACK));


    let availableMoves1 = whiteKing.generateMoves(game);
    let expectedAvailableMoves1 = [
        new RelocationMove(whiteKing.position, new utils.Point(whiteKing.position.x + 1, whiteKing.position.y - 1), []),
        new RelocationMove(whiteKing.position, new utils.Point(whiteKing.position.x + 1, whiteKing.position.y + 1), []),
        new IdleMove()
    ];
    let success1 = utils.areArraysEqual(availableMoves1, expectedAvailableMoves1);



    let availableMoves2 = blackKing.generateMoves(game);
    let expectedAvailableMoves2 = [
        new RelocationMove(blackKing.position, new utils.Point(blackKing.position.x - 1, blackKing.position.y - 1), []),
        new RelocationMove(blackKing.position, new utils.Point(blackKing.position.x - 1, blackKing.position.y + 1), []),
        new IdleMove()
    ];
    let success2 = utils.areArraysEqual(availableMoves2, expectedAvailableMoves2);

    if(!success1 || !success2){
        console.log("Moving king test failed 1");
    }
    else{
        console.log("Moving king test passed");
    }
};


var movingPeasantTest = function(){
    let game = new Game();
    let whiteKing = game.whiteKing;
    let blackKing = game.blackKing;
    let peasant = new Peasant(new utils.Point(whiteKing.position.x, whiteKing.position.y + 2), utils.BLACK);
    game.placeUnit(peasant);

    let availableMoves = peasant.generateMoves(game);
    let expectedAvailableMoves = [
        new RelocationMove(peasant.position, new utils.Point(whiteKing.position.x, whiteKing.position.y + 1), []),
        new RelocationMove(peasant.position, new utils.Point(whiteKing.position.x+1, whiteKing.position.y + 1), []),
        new RelocationMove(peasant.position, new utils.Point(whiteKing.position.x+1, whiteKing.position.y + 2), []),
        new RelocationMove(peasant.position, new utils.Point(whiteKing.position.x, whiteKing.position.y + 3), []),
        new RelocationMove(peasant.position, new utils.Point(whiteKing.position.x+1, whiteKing.position.y + 3), []),
        new IdleMove()
    ];

    let success = utils.areArraysEqual(availableMoves, expectedAvailableMoves);
    if(success){
        console.log("Moving peasant test passed");
    }
    else{
        console.log("Moving peasant test failed");
    }
}


var relocationMovesAssignmentTest = function(){
    let game = new Game();
    let whiteKing = game.whiteKing;
    let blackKing = game.blackKing;

    let whiteKingInitialPosition = new utils.Point(whiteKing.position.x, whiteKing.position.y);
    let blackKingInitialPosition = new utils.Point(blackKing.position.x, blackKing.position.y);

    let peasant = new Peasant(new utils.Point(whiteKing.position.x, whiteKing.position.y + 2), utils.BLACK);
    game.placeUnit(peasant);

    let peasantInitialPosition = new utils.Point(peasant.position.x, peasant.position.y);

    let rm = new RelocationMove(whiteKing.position, new utils.Point(whiteKing.position.x + 1, whiteKing.position.y + 1), []);
    game.assignMove(rm);

    if(game.matrix[whiteKingInitialPosition.x][whiteKingInitialPosition.y] !== null){
        console.log("Relocation move assignment test failed 1");
        return;
    }

    if(game.matrix[whiteKingInitialPosition.x+1][whiteKingInitialPosition.y+1] === null){
        console.log("Relocation move assignment test failed 2");
        return;
    }

    if(!(game.getCurrentUnit() instanceof King) || (game.getCurrentUnit().color != utils.BLACK)){
        console.log("Relocation move assignment test failed 3");
        return;
    }


    rm = new RelocationMove(blackKing.position, new utils.Point(blackKing.position.x - 1, blackKing.position.y + 1), []);
    game.assignMove(rm);

    if(game.matrix[blackKingInitialPosition.x][blackKingInitialPosition.y] !== null){
        console.log("Relocation move assignment test failed 4");
        return;
    }

    if(game.matrix[blackKingInitialPosition.x-1][blackKingInitialPosition.y+1] === null){
        console.log("Relocation move assignment test failed 5");
        return;
    }

    if(!(game.getCurrentUnit() instanceof Peasant) || (game.getCurrentUnit().color != utils.BLACK)){
        console.log("Relocation move assignment test failed 6");
        return;
    }

    rm = new RelocationMove(peasant.position, whiteKing.position, []);
    game.assignMove(rm);

    let expectedPeasant = game.matrix[whiteKingInitialPosition.x+1][whiteKingInitialPosition.y+1];

    if(!(expectedPeasant instanceof Peasant)){
        console.log("Relocation move assignment test failed 7");
        return;
    }


    if(game.units.length !== 2){
        console.log("Relocation move assignment test failed 8");
    }

    if(!(game.getCurrentUnit() instanceof King) || !(game.getCurrentUnit().color == utils.BLACK)){
        console.log("Relocation move assignment test failed 8");
    }

    console.log("Relocation move assignment test passed");
}



var incomeMoveTests = function() {
    let game = new Game();
    game.placeUnit(new GoldMine(new utils.Point(1, 5), utils.WHITE));
    game.placeUnit(new GoldMine(new utils.Point(2, 5), utils.WHITE));
    game.placeUnit(new StoneMine(new utils.Point(3, 5), utils.WHITE));
    game.placeUnit(new StoneMine(new utils.Point(4, 5), utils.BLACK));
    game.placeUnit(new GoldMine(new utils.Point(5, 5), utils.BLACK));


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

        if(whiteGold == expectedTable[i][0] && whiteStone == expectedTable[i][1] && blackGold == expectedTable[i][2] && blackStone == expectedTable[i][3]){
        }
        else{
            console.log("Income move test failed " + (i+1));
            return;
        }
    }

    console.log("Income move test passed");
}


var buildingMoveTests = function() {
    let game = new Game();
    game.placeUnit(new Builder(new utils.Point(game.whiteKing.position.x+1, game.whiteKing.position.y), utils.WHITE));
    game.placeUnit(new Builder(new utils.Point(game.blackKing.position.x-1, game.blackKing.position.y), utils.BLACK));
    game.whiteTreasury.stone = 7;


    let whiteKing = game.whiteKing;

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }

    let avMoves = game.genMovesForCurrentUnit();
    let found = false;
    for(var i = 0; i<avMoves.length; i++){
        let cmove = avMoves[i];
        if(cmove instanceof BuildingMove){
            if(cmove.unit.position.x === whiteKing.position.x + 1 && cmove.unit.position.y === whiteKing.position.y + 1){
                game.assignMove(cmove);
                found = true;
                break;
            }
        }
    }

    if(!found){
        console.log("Building move test failed 1");
        return;
    }

    if(game.units.length != 5){
        console.log("Building move test failed 2");
        return;
    }

    console.log("Building move test passed");
}


var shootingMoveTest = function() {
    let game = new Game();
    let whiteKing = game.whiteKing;
    let blackKing = game.blackKing;


    let pos = new utils.Point(Math.floor(utils.WIDTH/2), blackKing.position.y);
    game.placeUnit(new Archer(pos, utils.WHITE));

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }

    {
        let moves = game.genMovesForCurrentUnit();
        game.assignMove(moves[moves.length - 1]);
    }


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
        console.log("Shooting move test failed 1");
        return;
    }

    if(game.units.length != 2){
        console.log("Shooting move test failed 2");
        return;
    }

    console.log("Building move test passed");
}


movingKingTest();
movingPeasantTest();
relocationMovesAssignmentTest();
incomeMoveTests();
buildingMoveTests();
shootingMoveTest();