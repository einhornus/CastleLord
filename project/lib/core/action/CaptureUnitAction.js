utils = require("../utils");
Action = require("./Action")


class CaptureUnitAction extends Action{
    constructor(unit, enemy){
        super();
        this.unit = unit;
        this.enemy = enemy;
        this.type = "Capture building";
    }
}


module.exports = CaptureUnitAction;