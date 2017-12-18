Move = require("./Move");
FootMove = require("./FootMove")
utils = require("../utils");
MoveUnitAction = require("../action/MoveUnitAction");
AttackUnitAction = require("../action/AttackUnitAction");
CaptureUnitAction = require("../action/CaptureUnitAction");
ChangeStateAction = require("../action/ChangeStateAction");


class ChangeStateMove extends Move {
    constructor(unit) {
        super();
        this.unit = unit;
        this.type = "Change";
    }

    hash(){
        var res = this.unit.position.hash() ^ 493334;
        return res;
    }

    assign(unit, game) {
        unit.isMounted = !unit.isMounted;
        return [new ChangeStateAction(this.unit)];
    }
}

module.exports = ChangeStateMove;