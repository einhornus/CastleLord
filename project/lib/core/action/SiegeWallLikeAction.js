utils = require("../utils");
Action = require("./Action")


class SiegeWallLikeAction extends Action{
    constructor(unit, walllike){
        super();

        if(unit === undefined){
            throw new utils.Exception("Not defined");
        }

        if(walllike === undefined){
            throw new utils.Exception("Not defined");
        }

        this.unit = unit;
        this.walllike = walllike;
        this.type = "Siege walllike";
    }
}


module.exports = SiegeWallLikeAction;