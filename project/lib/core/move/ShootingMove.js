Move = require("./Move");
utils = require("../utils");
AttackUnitAction = require("../action/AttackUnitAction");



class ShootingMove extends Move{
    constructor(start, target, type){
        super();
        this.start = start;
        this.target = target;
        this.type = type;
    }

    assign(unit, game) {
        let startX = this.start.x;
        let startY = this.start.y;

        if (game.matrix[startX][startY] === null) {
            throw new utils.Exception("Starting point is empty");
            if (game.matrix[startX][startY] !== game.getCurrentUnit()) {
                throw new utils.Exception("Moving unit is not the current one");
            }
        }


        var targetX = this.target.x;
        var targetY = this.target.y;

        var enemySoldier = null;

        if(this.type === "Stone") {
            if (game.towers[targetX][targetY] === null) {
                enemySoldier = game.matrix[targetX][targetY];
            }
            else {
                enemySoldier = game.towers[targetX][targetY];
            }
        }
        else{
            enemySoldier = game.matrix[targetX][targetY];
        }

        var kills= null;
        var damage = null;

        if (enemySoldier !== null) {
            var atRes = game.attackUnit(game.matrix[startX][startY], enemySoldier);
            kills = atRes[0];
            damage = atRes[1];
        }

        var res = [];
        res.push(new AttackUnitAction(unit, this.start, this.target, enemySoldier, kills, damage));

        return res;
    }
}

module.exports = ShootingMove;