utils = require("../utils");
Action = require("./Action")


class HealUnitAction extends Action{
    constructor(unit, from, to, enemy, surplus){
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

        this.unit = unit;
        this.from = from;
        this.to = to;
        this.enemy = enemy;
        this.surplus = surplus;
        this.type = "Heal unit";
    }
}


module.exports = HealUnitAction;