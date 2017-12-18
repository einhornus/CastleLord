Move = require("./Move");
FootMove = require("./FootMove")
utils = require("../utils");
MoveUnitAction = require("../action/MoveUnitAction");



class RelocationMove extends FootMove {
    constructor(end, path) {
        super(end, path);
        this.type = "Relocation";

        if(end === undefined){
            throw new utils.Exception("Not defined");
        }

        if(path === undefined){
            throw new utils.Exception("Not defined");
        }

        if(path.length !== 0) {
            if (path[path.length - 1].to.hash() !== end.hash()) {
                throw new utils.Exception("Not same");
            }
        }
        else{
            throw new utils.Exception("Eq 0");
        }
    }

    hash(){
        var res = 4389;
        res ^= this.end.hash();
        for(var i = 0; i<this.path.length; i++) {
            res ^= this.path[i].from.hash() ^ 344;
            res ^= this.path[i].to.hash() ^ 86;
        }
        return res;
    }

    assign(unit, game) {
        for(var i = 0; i<this.path.length; i++){
            var pt = this.path[i].to;
            if(game.matrix[pt.x][pt.y] !== null){
                if(game.matrix[pt.x][pt.y].type !== "Gate") {
                    throw new utils.Exception("Blocking path");
                }
            }
        }

        let from = unit.position;
        let action = new MoveUnitAction(unit, from, this.end, this.path);
        let res = [action];

        game.moveUnit(unit, this.end);
        return res;
    }
}

module.exports = RelocationMove;