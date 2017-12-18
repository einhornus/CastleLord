utils = require("../utils");
Action = require("./Action")


class MoveUnitAction extends Action{
    constructor(unit, from, to, path){
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

        if(path === undefined){
            throw new utils.Exception("Not defined");
        }

        if(path[0].from.hash() !== from.hash()){
            throw new utils.Exception("Not same");
        }

        if(path[path.length - 1].to.hash() !== to.hash()){
            throw new utils.Exception("Not same");
        }

        this.unit = unit;
        this.path = path;
        this.from = from;
        this.to = to;
        this.type = "Move unit";
    }
}


module.exports = MoveUnitAction;