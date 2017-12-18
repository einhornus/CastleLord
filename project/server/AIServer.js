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

var express = require('express');
var app = express();

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

var port = 4000;
var server = require('http').Server(app);

console.log("Server started");

server.listen(port);

var io = require('socket.io')(server);

var size = mapGenerator.MAP_SETTINGS_VALUES.SIZE.NORMAL;
var initialTroops = mapGenerator.MAP_SETTINGS_VALUES.INITIAL_TROOPS.NORMAL;
var initialResources = mapGenerator.MAP_SETTINGS_VALUES.INITIAL_RESOURCES.NORMAL;
var castleSize = mapGenerator.MAP_SETTINGS_VALUES.CASTLE_SIZE.NORMAL;

var mapSettings = new mapGenerator.MapSettings(size, initialTroops, initialTroops, castleSize);
var map = mapGenerator.generate(mapSettings);
var game = new Game(map);

var mySocket = null;
var actionPool = [];

var sendAction = function (action) {
    if(mySocket !== null) {
        mySocket.emit("action", action);
        //console.log("Sent", action);
    }
}


io.on('connection', function (socket) {
    console.log("New socket");
    mySocket = socket;
    socket.emit("connect", {});

    let actions = game.getInitActions();
    actionPool = [];
    for(var i = 0; i<actions.length; i++){
        actionPool.push(actions[i]);
    }
    let moveAction = new YourMoveAction(game.getCurrentUnit(), game.genMovesForCurrentUnit(), game);
    actionPool.push(moveAction);
    sendAction(actionPool[0]);


    socket.on('answer', function (answer) {
        answer = JSON.parse(answer);
        if(answer.type === "Move"){
            actionPool.splice(0, 1);
            let index = answer.index;
            let moves = game.genMovesForCurrentUnit();
            let move = moves[index];

            console.log(move);
            var actions = game.assignMove(move);
            for(var i = 0; i<actions.length; i++){
                actionPool.push(actions[i]);
            }

            /*
            while(true) {
                if (game.getCurrentUnit().color === utils.NEUTRAL) {
                    var bear = game.getCurrentUnit();
                    var _moves = game.genMovesForCurrentUnit();
                    var moveIndex= bear.getMove(_moves, game)
                    var actualMove = _moves[moveIndex];

                    console.log("Apply move", actualMove);
                    var _actions = game.assignMove(actualMove);
                    for (var i = 0; i < _actions.length; i++) {
                        actionPool.push(_actions[i]);
                    }
                }
                else{
                    break;
                }
            }
            */

            moves = game.genMovesForCurrentUnit();
            let moveAction = new YourMoveAction(game.getCurrentUnit(), moves, game);
            actionPool.push(moveAction);
            sendAction(actionPool[0]);
        }

        if(answer.type === "Response"){
            console.log("Here it is");

            actionPool.splice(0, 1);

            if(actionPool.length > 0){
                var acToSend = actionPool[0];
                sendAction(actionPool[0]);
            }
        }
    });


    socket.on('error',function(er){
        console.log(er);
        exit(0);
    });
});


