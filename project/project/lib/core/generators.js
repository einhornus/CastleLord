utils = require("./utils");


var filterForValidCells = function(cells){
    let res = [];
    for(var i = 0; i<cells.length; i++){
        if(utils.isPointValid(cells[i])){
            res.push(cells[i]);
        }
    }
    return res;
}

var filterForFriendlyUnits = function(cells, game, color){
    let res = [];
    for(var i = 0; i<cells.length; i++){
        let good = true;
        if(game.matrix[cells[i].x][cells[i].y] !== null){
            if(game.matrix[cells[i].x][cells[i].y].color === color){
                good = false;
            }
        }
        if(good){
            res.push(cells[i]);
        }
    }
    return res;
}


var filterForDirectionObstacles = function(direction, game){
    let res = [];
    let obstacles = 0;
    for(var i = 0; i<direction.length; i++){
        if(game.matrix[direction[i].x][direction[i].y] !== null){
            obstacles++;
            if(obstacles > 1){
                break;
            }
        }

        res.push(direction[i]);
    }
    return res;
}

var generatePointsInDirections = function(position, directions, range, game, color, doIgnoreObstacles, doMakeIntermediateMoves){
    let res = []
    for(let i = 0; i<directions.length; i++){
        let direction = [];
        for(var j = 0; j<range; j++){
            let point = new utils.Point(position.x + (j+1)*directions[i][0], position.y + (j+1)*directions[i][1])
            direction.push(point);
        }

        direction = filterForValidCells(direction);
        direction = filterForFriendlyUnits(direction, game, color);

        if(!doIgnoreObstacles){
            direction = filterForDirectionObstacles(direction, game);
        }

        for(var j = 0; j<direction.length; j++){
            if(!doMakeIntermediateMoves) {
                res.push(direction[j]);
            }
            else{
                let structure = {
                    end : direction[i],
                    inters : []
                }

                for(var k = 0; k<j; k++){
                    structure.inters.push(direction[k]);
                }

                res.push(structure);
            }
        }
    }
    return res;
}

module.exports.generatePointsInDirections = generatePointsInDirections;