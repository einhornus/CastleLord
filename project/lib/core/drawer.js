utils = require("./utils");
generators = require("./generators");
King = require("./unit/combatant/Lord");
Peasant = require("./unit/combatant/Worker");
Builder = require("./unit/combatant/Worker");
GoldMine = require("./unit/building/House");
Archer = require("./unit/combatant/Archer");
Barrack = require("./unit/building/Barrack");
StoneMine = require("./unit/building/IronMine");
Move = require("./move/Move");
IdleMove = require("./move/IdleMove");
BuildingMove = require("./move/BuildingMove");
RelocationMove = require("./move/RelocationMove");
ShootingMove = require("./move/ShootingMove");
IncomeMove = require("./move/IncomeMove");


var EMPTY = '.';
var CENTRAL_CRAP = 'X';

var CAN_GO_BOTH = ' ';

var CAN_GO_WHITE_ONLY_VERTICAL = '}';
var CAN_GO_BLACK_ONLY_VERTICAL = "{";
var CAN_GO_WHITE_ONLY_HORIZONTAL = '~';
var CAN_GO_BLACK_ONLY_HORIZONTAL = "^";

var CAN_GO_NOONE_HORIZONTAL = "-";
var CAN_GO_NOONE_VERTICAL = "|";


var unitToString = function(unit) {
    let res = "";
    if (unit.type === "Lord" && unit.color === utils.WHITE) {
        res += 'L';
    }

    if (unit.type === "Lord" && unit.color === utils.BLACK) {
        res += 'l';
    }

    if (unit.type === "Worker" && unit.color === utils.WHITE) {
        res += 'W';
    }

    if (unit.type === "Worker" && unit.color === utils.BLACK) {
        res += 'w';
    }

    if (unit.type === "Gold mine" && unit.color === utils.WHITE) {
        res += 'G';
    }

    if (unit.type === "Gold mine" && unit.color === utils.BLACK) {
        res += 'g';
    }

    if (unit.type === "Iron mine" && unit.color === utils.WHITE) {
        res += 'I';
    }

    if (unit.type === "Iron mine"  && unit.color === utils.BLACK) {
        res += 'i';
    }

    if (unit.type === "Barrack" && unit.color === utils.WHITE) {
        res += 'B';
    }

    if (unit.type === "Barrack" && unit.color === utils.BLACK) {
        res += 'b';
    }

    if (unit.type === "Church" && unit.color === utils.WHITE) {
        res += 'C';
    }

    if (unit.type === "Church" && unit.color === utils.BLACK) {
        res += 'c';
    }

    if (unit.type === "Farm" && unit.color === utils.WHITE) {
        res += 'F';
    }

    if (unit.type === "Farm"  && unit.color === utils.BLACK) {
        res += 'f';
    }

    return res;
}


var drawQueue = function(game){
    let res = "";
    for (let i = 0; i < game.units.length; i++) {
        if (game.unitPointer === i) {
            res += '|';
        }
        else {
            res += "-";
        }
    }

    res += "\n";

    for (let i = 0; i < game.units.length; i++) {
        res += unitToString(game.units[i]);
    }

    return res;
}

var getBoardPoint = function(map, position){
    var x = position.x;
    var y = position.y;
    return new utils.Point(2*x, 2*y);
}

var getBoardInterpoint = function(map, position1, position2){
    var x1 = position1.x * 2;
    var y1 = position1.y * 2;
    var x2 = position2.x * 2;
    var y2 = position2.y * 2;
    var x = (x1+x2)/2;
    var y = (y2+y1)/2;
    return new utils.Point(x, y);
}

var makeBoard = function(game){
    let presentationWidth = game.map.width * 2 - 1;
    let presentationHeight = game.map.height * 2 - 1;

    let board = utils.create2DArray(presentationWidth, presentationHeight, EMPTY);



    return board;
}


var drawTroops = function(game, board){
    for(var i = 0; i<game.map.width; i++){
        for(var j = 0; j<game.map.height; j++){
            var p = getBoardPoint(game.map, new utils.Point(i, j));
            if(game.matrix[i][j] !== null){
                var ch = unitToString(game.matrix[i][j]);
                board[p.x][p.y] = ch;
            }
            else{
                if(game.hasTower(new utils.Point(i, j))){
                    board[p.x][p.y] = "T";
                }
            }
        }
    }
}


var drawMoves = function(game, board){
    var moves = game.genMovesForCurrentUnit();

    for(var i = 0; i<moves.length; i++){
        var move = moves[i];
        if(move instanceof RelocationMove){
            var end = move.end;
            var len = move.path.length;
            var p = getBoardPoint(game.map, end);
            board[p.x][p.y] = len;
        }
    }
}


var boardToStr = function(board){
    var res = "  ";

    for(var i = 0; i<board.length; i++) {
        if(i%2 === 0){
            res += ((i)/2)+"";
        }
        else{
            res += " ";
        }
    }

    res += "\n"

    res += "  ";
    for(var i = 0; i<board.length; i++) {
        res += CAN_GO_NOONE_HORIZONTAL;
    }

    res += "\n"

    for(var i = 0; i<board[0].length; i++){

        if(i%2 === 0){
            res += ((i)/2)+"";
        }
        else{
            res += " ";
        }
        res+=CAN_GO_NOONE_VERTICAL;


        for(var j = 0; j<board.length; j++){

            if(i%2 === 1 && j%2 == 1){
                res += CENTRAL_CRAP;
            }
            else {
                res += board[j][i];
            }
        }
        res += "\n";
    }
    return res;
}


var getGame = function(game){
    var queue = drawQueue(game);
    var board = makeBoard(game);
    drawTroops(game, board);
    drawMoves(game, board);
    var strBoard = boardToStr(board);
    var res = queue+"\n\n"+strBoard;
    return res;
}

var printGame = function(game){
    console.log(getGame(game));
}

module.exports.printGame = printGame;
module.exports.getGame = getGame;



