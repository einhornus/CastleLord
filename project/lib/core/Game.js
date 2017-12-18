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
Treasury = require("./Treasury");
IdleMove = require("./move/IdleMove");
BuildingMove = require("./move/BuildingMove");
RelocationMove = require("./move/RelocationMove");
ShootingMove = require("./move/ShootingMove");
IncomeMove = require("./move/IncomeMove");
AppearUnitAction = require("./action/AppearUnitAction");
InitGameAction = require("./action/InitGameAction");


let DEBUG = true;

class Game {
    constructor(map) {
        this.whiteTreasury = map.initialWhiteTreasury;
        this.blackTreasury = map.initialBlackTreasury;

        this.units = [];

        this.unitPointer = 0;
        this.matrix = utils.create2DArray(map.width, map.height, null);
        this.towers = utils.create2DArray(map.width, map.height, null);


        let whiteKing = new King(map.initialWhiteKingPosition, utils.WHITE);
        let blackKing = new King(map.initialBlackKingPosition, utils.BLACK);
        this.whiteKing = whiteKing;
        this.blackKing = blackKing;


        for (var i = 0; i < map.initialTroops.length; i++) {
            this.placeUnit(map.initialTroops[i]);
        }

        this.placeUnit(whiteKing);
        this.placeUnit(blackKing);


        this.map = map;
    }

    getCurrentUnit() {
        return this.units[this.unitPointer];
    }

    placeUnit(unit) {
        if (unit.type !== "Tower") {
            if (this.matrix[unit.position.x][unit.position.y] !== null) {
                throw new utils.Exception("The cell is occupied");
            }
            this.units.push(unit);
            unit.postMove(this);
            this.matrix[unit.position.x][unit.position.y] = unit;
        }
        else {
            this.units.push(unit);
            this.towers[unit.position.x][unit.position.y] = unit;
        }
    }

    calculateDamage(attacker, defender) {
        if (defender === null) {
            return -1;
        }

        let damage = utils.getDamage(attacker.getWeapon(), defender.getArmour());
        damage *= utils.GAME_PARAMS.DAMAGE_MODIFIER;

        if (attacker.getWeapon() === utils.GAME_PARAMS.WEAPON.BOW || attacker.getWeapon() === utils.GAME_PARAMS.WEAPON.STONES) {
            var actualDistance = utils.dist(attacker.position, defender.position);

            var distanceModifier = 1.0;
            if (this.hasTower(attacker.position)) {
                distanceModifier /= utils.GAME_PARAMS.RANGE.HEIGHT;
            }

            if (this.hasTower(defender.position) && attacker.getWeapon() === utils.GAME_PARAMS.WEAPON.BOW) {
                distanceModifier *= utils.GAME_PARAMS.RANGE.HEIGHT;
            }

            var modifiedDistance = distanceModifier * actualDistance;

            var modifier = Math.pow(2.71, -utils.GAME_PARAMS.RANGE.K * (modifiedDistance * modifiedDistance));
            damage *= modifier;
        }

        if ((attacker.type === "Catapult") || (defender.isBuilding())) {

        }
        else {
            var attackModifier = attacker.getMoraleAttackModifier();
            var defenceModifier = defender.getMoraleDefenceModifier();
            damage *= attackModifier;
            damage /= defenceModifier;
        }

        damage = Math.round(damage);

        if (isNaN(damage)) {
            throw new utils.Exception("Nan damage");
        }

        return damage;
    }

    attackUnit(attacker, defender) {
        let damage = this.calculateDamage(attacker, defender);

        if (defender.health <= damage) {
            this.killUnit(defender);
            return [true, damage];
        }
        else {
            defender.health -= damage;
            return [false, damage];
        }
    }


    healUnit(healer, defender) {
        var heal = Math.min(100 - defender.health, utils.GAME_PARAMS.HEAL_VOLUME);
        defender.heal += heal;
        return heal;
    }

    killUnit(unit) {
        if (unit.type === "Tower") {
            this.towers[unit.position.x][unit.position.y] = null;
        }
        else {
            this.matrix[unit.position.x][unit.position.y] = null;
        }
        let index = this.findUnit(unit);
        this.units[index] = null;
        this.recalculateIndexes();
    }

    findUnit(unit) {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i] === unit) {
                return i;
            }
        }
        throw new utils.Exception("Unit not found");
    }

    recalculateIndexes() {
        let currentUnit = this.getCurrentUnit();
        let newUnits = [];
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i] !== null) {
                newUnits.push(this.units[i]);
            }
        }
        this.units = newUnits;
        this.unitPointer = this.findUnit(currentUnit);
    }

    moveUnit(unit, newLocation) {
        if (this.matrix[newLocation.x][newLocation.y] !== null) {
            throw new utils.Exception("Can't move unit here");
        }

        this.matrix[unit.position.x][unit.position.y] = null;
        unit.position = new utils.Point(newLocation.x, newLocation.y);
        this.matrix[unit.position.x][unit.position.y] = unit;
    }


    checkInvariants() {
        this.checkUnitsInvariant();
    }

    checkUnitsInvariant() {
        for (let i = 0; i < this.units.length; i++) {
            let unit = this.units[i];

            let x = unit.position.x;
            let y = unit.position.y;
            if (this.matrix[x][y] === null && this.towers[x][y] === null) {
                throw new utils.Exception("Invariant violated: matrix is null");
            }
        }

        let matrixUnitCount = 0;
        for (let i = 0; i < this.map.width; i++) {
            for (let j = 0; j < this.map.height; j++) {
                if (this.matrix[i][j] !== null) {
                    matrixUnitCount++;
                }

                if (this.towers[i][j] !== null) {
                    matrixUnitCount++;
                }
            }
        }

        if (matrixUnitCount !== this.units.length) {
            throw new utils.Exception("Unit counts are not the same");
        }
    }

    genMovesForCurrentUnit() {
        return this.getCurrentUnit().generateMoves(this);
    }

    nextUnit() {
        this.unitPointer++;
        if (this.unitPointer === this.units.length) {
            this.unitPointer = 0;
        }

        while (true) {
            var currentUnit = this.getCurrentUnit();


            if (currentUnit.type === "Wall" || currentUnit.type === "Tower") {
                this.unitPointer++;
                if (this.unitPointer === this.units.length) {
                    this.unitPointer = 0;
                }
            }
            else {
                break;
            }
        }
    }

    assignMove(move) {
        if (move === undefined) {
            throw new utils.Exception("Not defined");
        }

        let actions = move.assign(this.getCurrentUnit(), this);

        this.nextUnit();
        if (DEBUG) {
            this.checkInvariants();
        }

        while (true) {
            if (this.getCurrentUnit().color === utils.NEUTRAL) {
                var bear = this.getCurrentUnit();
                var _moves = this.genMovesForCurrentUnit();
                var moveIndex = bear.getMove(_moves, this)
                var actualMove = _moves[moveIndex];

                console.log("Apply move", actualMove);
                var _actions = this.assignMove(actualMove);
                for (var i = 0; i < _actions.length; i++) {
                    actions.push(_actions[i]);
                }
            }
            else {
                break;
            }
        }

        return actions;
    }

    getInitActions() {
        let res = [];
        res.push(new InitGameAction(this));
        return res;
    }


    getFoodIncome(color) {
        var res = 0;
        for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (unit.color === color) {
                if (unit.type === "Farm") {
                    res += this.units[i].getIncome();
                }
                else {
                    if (!unit.isBuilding() || unit.type === "House") {
                        if (unit.color === color) {
                            res -= unit.getFoodConsumption();
                        }
                    }
                }
            }
        }
        return res;
    }

    getGoldIncome(color) {
        var res = 0;
        for (var i = 0; i < this.units.length; i++) {
            var unit = this.units[i];
            if (unit.type === "House") {
                if (unit.color === color) {
                    res += utils.GAME_PARAMS.INCOME.HOUSE;
                }
            }
        }
        return res;
    }

    getIronIncome(color) {
        var res = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].type === "Mine") {
                if (this.units[i].color === color) {
                    res += utils.GAME_PARAMS.INCOME.MINE;
                }
            }
        }
        return res;
    }

    getStoneIncome(color) {
        var res = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].type === "Mine") {
                if (this.units[i].color === color) {
                    res += utils.GAME_PARAMS.INCOME.QUARRY;
                }
            }
        }
        return res;
    }

    hasTower(point) {
        return (this.towers[point.x][point.y] !== null);
    }
}

module.exports = Game;