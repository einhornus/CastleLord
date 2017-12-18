utils = require("../utils");
Action = require("./Action")


class ChangeStateAction extends Action{
    constructor(unit){
        super();
        this.unit = unit;
        this.type = "Change state";
    }
}


module.exports = ChangeStateAction;