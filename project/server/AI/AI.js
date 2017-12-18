function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var move = function(game){
    var unit = game.getCurrentUnit();
    var allTheMoves = game.genMovesForCurrentUnit();

    var relocationMoves = [];
    var otherMoves = [];

    for(var i = 0; i<allTheMoves.length; i++){
        if(allTheMoves[i].type === "Relocation"){
            relocationMoves.push(allTheMoves[i]);
        }
        else{
            otherMoves.push(allTheMoves[i]);
        }
    }


    var res = null;
    if(otherMoves.length > 0){
        var index = getRandomInt(0, otherMoves.length);
        res = otherMoves[index];
    }
    else{
        var index = getRandomInt(0, allTheMoves.length);
        res = allTheMoves[index];
    }
    return res;
}

module.exports.move = move;