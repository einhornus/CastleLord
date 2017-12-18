Move = require("./Move");
FootMove = require("./FootMove")
utils = require("../utils");
MoveUnitAction = require("../action/MoveUnitAction");
AttackUnitAction = require("../action/AttackUnitAction");
CaptureUnitAction = require("../action/CaptureUnitAction");


class CaptureMove extends Move {
    constructor(from, enemy) {
        super();
        this.enemy = enemy;
        this.from = from;
        this.type = "Capture";
    }

    hash(){
        var res = 1123;
        res ^= this.end.hash();
        for(var i = 0; i<this.path.length; i++) {
            res ^= this.path[i].from.hash() ^ 124;
            res ^= this.path[i].to.hash() ^ 46767;
        }
        res ^= 444;
        res ^= this.enemy.position.hash();
        return res;
    }

    assign(unit, game) {
        let res = [];
        let last = new CaptureUnitAction(unit, this.enemy);

        if(this.enemy.color === utils.WHITE){
            this.enemy.color = utils.BLACK;
        }
        else{
            this.enemy.color = utils.WHITE;
        }
        res.push(last);

        return res;
    }
}

module.exports = CaptureMove;