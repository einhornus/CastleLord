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
    }

    isBuilding() {
        return false;
    }


    getMove(moves, game){
        for(var i = 0; i<moves.length; i++){
            if(moves[i].type === "Attack"){
                return i;
            }
        }


        var lookupRadius = utils.GAME_PARAMS.SIGHT_RADIUS;
        var triggered = false;
        var nearestUnitPos = 0;
        var nearestUnitDist = 1000;
        for(var i = 0; i<game.units.length; i++){
            var unit = game.units[i]
            if(!unit.isBuilding()){
                if(unit.type !== "Bear"){
                    var d = utils.dist(this.position, unit.position);
                    if(d <= lookupRadius){
                        triggered = true;
                        if(d < nearestUnitDist){
                            nearestUnitDist = d;
                            nearestUnitPos = unit.position;
                        }
                    }
                }
            }
        }

        if(triggered){
            var nearestD = 10000;
            var res = 0;
            for(var i = 0; i<moves.length; i++){
                if(moves[i].type === "Relocation"){
                    var tile = moves[i].end;
                    var d = utils.dist(tile, nearestUnitPos);
                    if(d < nearestD){
                        nearestD = d;
                        res = i;
                    }
                }
            }
            return res;
        }
        else{
            return moves.length - 1;
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