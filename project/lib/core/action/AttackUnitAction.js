utils = require("../utils");
Action = require("./Action")


class AttackUnitAction extends Action{
    constructor(unit, from, to, enemy, kills, damage, weapon, armour){
        super();

        if(unit === undefined){
            throw new utils.Exception("Not defined");
        }

        if(from === undefined){
            throw new utils.Exception("Not defined");
        }

        if(to === undefined){
            throw new utils.Exception("Not defined");
        }

        if(enemy === undefined){
            throw new utils.Exception("Not defined");
        }

        if(kills === undefined){
            throw new utils.Exception("Not defined");
        }

        this.unit = unit;
        this.from = from;
        this.to = to;
        this.enemy = enemy;
        this.kills = kills;
        this.damage = damage;
        this.weapon = weapon;
        this.armour = armour;
        this.type = "Attack unit";
    }
}


module.exports = AttackUnitAction;