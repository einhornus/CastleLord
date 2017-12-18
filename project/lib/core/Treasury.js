
utils = require("./utils");
generators = require("./generators");
King = require("./unit/combatant/Lord");
Peasant = require("./unit/combatant/Worker");
Builder = require("./unit/combatant/Worker");
GoldMine = require("./unit/building/House");
Archer = require("./unit/combatant/Archer");
Barrack = require("./unit/building/Barrack");
StoneMine = require("./unit/building/IronMine");
Move = require("./move/Move");
IdleMove = require("./move/IdleMove");
BuildingMove = require("./move/BuildingMove");
RelocationMove = require("./move/RelocationMove");
ShootingMove = require("./move/ShootingMove");
IncomeMove = require("./move/IncomeMove");
AppearUnitAction = require("./action/AppearUnitAction");
InitGameAction = require("./action/InitGameAction");

class Treasury {
    constructor(gold, stone, iron, food) {
        this.gold = gold;
        this.stone = stone;
        this.iron = iron;
        this.food = food;
    }
}


module.exports = Treasury;