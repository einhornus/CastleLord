utils = require("../utils");
Action = require("./Action")



class InitGameAction extends Action{
    constructor(game){
        super();

        if(game === undefined){
            throw new utils.Exception("Not defined");
        }

        this.game = game;
        this.type = "Init game";
    }
}


module.exports = InitGameAction;