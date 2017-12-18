Move = require("./Move");

class ShootingMove extends Move{
    constructor(start, target){
        super();
        this.start = start;
        this.target = target;
    }
}

module.exports = ShootingMove;