utils = require("../utils");
Action = require("./Action")


class BuildUnitAction extends Action{
    constructor(unit, from, to, recruit){
        super();
        this.unit = unit;
        this.to = to;
        this.from = from;
        this.recruit = recruit;
        this.type = "Attack unit";
    }
}


module.exports = BuildUnitAction;