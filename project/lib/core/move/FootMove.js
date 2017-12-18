Move = require("./Move");


class FootMove extends Move{
    constructor(end, path){
        super();
        this.end = end;
        this.path = [];
        for(var i = 0; i<path.length; i++){
            this.path.push(path[i]);
        }

        this.type = "Foot";
    }

    hash() {
        let res = 363;
        res ^= this.end.hash();
        for(let i = 0; i<this.path.length; i++){
            res ^= this.path[i].hash();
        }
        return res;
    }
}

module.exports = FootMove;