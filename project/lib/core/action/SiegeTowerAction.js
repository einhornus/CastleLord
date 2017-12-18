utils = require("../utils");
Action = require("./Action")


class SiegeTowerAction extends Action{
    constructor(unit, tower){
        super();

        if(unit === undefined){
            throw new utils.Exception("Not defined");
        }

        if(tower === undefined){
            throw new utils.Exception("Not defined");
        }

        this.unit = unit;
        this.tower = tower;
        this.type = "Siege tower";
    }
}


module.exports = SiegeTowerAction;