Game = require("./core/Game.js");

var game = new Game();
game.initialize();
console.log(game.toString());

let currentUnit = game.getCurrentUnit();
let moves = currentUnit.generateMoves(game);
console.log(moves);