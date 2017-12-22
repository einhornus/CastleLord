Unit = require("../Unit");
utils = require("../../utils");
generators = require("../../generators");
ShootingMove = require("../../move/ShootingMove");
RelocationMove = require("../../move/RelocationMove");
IdleMove = require("../../move/IdleMove");



class Bear extends Unit{
    constructor(position, color){
        super(position, color);
        this.type = "Bear";
        this.triggerUnit = null;

        this.mainHeight = 1.0;
    }

    isBuilding() {
        return false;
    }


    getMove(moves, game){
        var attackMoves = [];
        var relocationMoves = [];

        for(var i = 0; i<moves.length; i++) {
            moves[i].poolIndex = i;
        }

        for(var i = 0; i<moves.length; i++){
            if(moves[i].type === "Attack"){
                attackMoves.push(moves[i]);
            }

            if(moves[i].type === "Relocation"){
                relocationMoves.push(moves[i]);
            }
        }

        if(attackMoves.length !== 0){
            var closest = null;
            var minDistance = 10000;
            for(var i = 0; i<attackMoves.length; i++){
                var d = utils.dist(this.position, attackMoves[i].enemy.position);
                if(d < minDistance){
                    minDistance = d;
                    closest = attackMoves[i].poolIndex;
                }
            }
            return closest;
        }

        var calm = true;
        if(this.triggerUnit !== null){
            if(Bear.isUnitInsideCastle(this.triggerUnit, game)){
                this.triggerUnit = null;
                calm = true;
            }
            else{
                calm = false;
            }
        }

        if(calm){
            var bestDist = 1000;
            var sightPoints = generators.generateSightPoints(this, game);
            for(var i = 0; i<sightPoints.length; i++){
                var sp = sightPoints[i];
                if(game.matrix[sp.x][sp.y] !== null){
                    var candidate = game.matrix[sp.x][sp.y];
                    var dist = utils.dist(candidate.position, this.position);
                    if (!candidate.isBuilding() && candidate.type !== "Bear") {
                        if(dist < bestDist) {
                            this.triggerUnit = candidate;
                            bestDist = dist;
                        }
                    }
                }
            }
        }


        if(this.triggerUnit !== null) {
            var closest = null;
            var minDistance = 10000;
            for (var i = 0; i < relocationMoves.length; i++) {
                var rm = relocationMoves[i];
                var d = utils.dist(this.triggerUnit.position, rm.end);
                if (d < minDistance) {
                    minDistance = d;
                    closest = rm.poolIndex;
                }
            }
            return closest;
        }
        else{
            return moves.length - 1;
        }
    }

    static isUnitInsideCastle(unit, game){
        if(unit.color === utils.WHITE){
            return game.map.whiteCastle.isInsideCastle(unit.position.x, unit.position.y);
        }
        else{
            return game.map.blackCastle.isInsideCastle(unit.position.x, unit.position.y);
        }
    }

    generateMoves(game){
        let rel = this.generateRelocationMoves(game);
        let attack = this.generateAttackingMoves(game);
        let res = utils.concatMoves(rel, attack);
        res.push(new IdleMove());
        return res;
    }

    getFoodConsumption() {
        return 0;
    }

    postMove(game) {
        this.morale = 0;
    }

    getWeapon() {
        return utils.GAME_PARAMS.WEAPON.BEAR;
    }

    getArmour() {
        return utils.GAME_PARAMS.ARMOUR.BEAR;
    }
}

module.exports = Bear;