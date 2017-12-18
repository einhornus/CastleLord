utils = require("../utils");
Action = require("./Action")


class DisappearUnitAction extends Action{
    constructor(unit){
        super();

        if(kills === undefined){
            throw new utils.Exception("Not defined");
        }

        this.unit = unit;
        this.type = "Disappear unit";
    }
}

module.exports = DisappearUnitAction;