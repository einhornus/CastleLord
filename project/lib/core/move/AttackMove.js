Move = require("./Move");
FootMove = require("./FootMove")
utils = require("../utils");
MoveUnitAction = require("../action/MoveUnitAction");
AttackUnitAction = require("../action/AttackUnitAction");


class AttackMove extends FootMove {
    constructor(end, path, enemy) {
        super(end, path);
        this.enemy = enemy;
        this.type = "Attack";
        
        if(end === undefined){
            throw new utils.Exception("Not defined");
        }

        if(path === undefined){
            throw new utils.Exception("Not defined");
        }

        if(path.length > 0) {
            if (path[path.length - 1].to.hash() !== end.hash()) {
                throw new utils.Exception("Not same");
            }
        }
        this.type = "Attack";
    }

    hash(){
        var res = 224;
        res ^= this.end.hash();
        for(var i = 0; i<this.path.length; i++) {
            res ^= this.path[i].from.hash() ^ 124;
            res ^= this.path[i].to.hash() ^ 46767;
        }
        res ^= 865;
        res ^= this.enemy.position.hash();
        return res;
    }

    assign(unit, game) {
        let endX = this.enemy.position.x;
        let endY = this.enemy.position.y;
        let pre = unit.position;

        if(endX === undefined || endY === undefined){
            throw new utils.Exception("Not defined");
        }

        if (game.matrix[endX][endY] === null) {
            throw new utils.Exception("The cell is empty");
        }

        let anotherUnit = game.matrix[endX][endY];
        if (anotherUnit.color === unit.color) {
            throw new utils.Exception("You can't take your own unit");
        }

        if (this.path.length > 0) {
            var prePath = this.end;
            game.moveUnit(unit, prePath);
        }
        else {

        }

        let enemyTroop = game.matrix[this.enemy.position.x][this.enemy.position.y];
        var atRes = game.attackUnit(unit, anotherUnit);

        let res = [];

        if(this.path.length > 0) {
            let action = new MoveUnitAction(unit, pre, this.end, this.path);
            res.push(action);
        }

        let last = new AttackUnitAction(unit, this.end, this.enemy.position, enemyTroop, atRes[0], atRes[1]);
        res.push(last);

        return res;
    }
}

module.exports = AttackMove;