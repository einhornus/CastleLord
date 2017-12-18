Move = require("./Move");

class RelocationMove extends Move{
    constructor(start, end, intermediate){
        super();
        this.start = start;
        this.end = end;
        this.intermediate = [];
        for(var i = 0; i<intermediate.length; i++){
            this.intermediate.push(intermediate[i]);
        }
    }

    hash() {
        let res = 0;
        res ^= this.start.hash();
        res ^= this.end.hash();
        for(let i = 0; i<this.intermediate.length; i++){
            res ^= this.intermediate[i].hash();
        }
        return res;
    }

}

module.exports = RelocationMove;