utils = require("../utils");
Action = require("./Action")



class AppearUnitAction extends Action{
    constructor(unit){
        super();
        this.unit = unit;

        if(unit === undefined){
            throw new utils.Exception("Not defined");
        }

        this.type = "Appear unit";
    }
}


module.exports = AppearUnitAction;