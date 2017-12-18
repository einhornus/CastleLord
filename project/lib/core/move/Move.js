utils = require("../utils");

class Move{
    assign(unit, game){
        throw new utils.Exception("Abstract method");
    }
}

module.exports = Move;