utils = require("./utils");
King = require("./unit/King");
Peasant = require("./unit/Peasant");
Builder = require("./unit/Builder");
GoldMine = require("./unit/GoldMine");
Archer = require("./unit/Archer");
Barrack = require("./unit/Barrack");
StoneMine = require("./unit/StoneMine");
Move = require("./move/Move");
IdleMove = require("./move/IdleMove");
BuildingMove = require("./move/BuildingMove");
RelocationMove = require("./move/RelocationMove");
ShootingMove = require("./move/ShootingMove");
IncomeMove = require("./move/IncomeMove");

let DEBUG = true;

class Treasury {
    constructor(gold, stone) {
        this.gold = gold;
        this.stone = stone;
    }
}

class Game {
    constructor() {
        this.whiteTreasury = new Treasury(0, 0);
        this.blackTreasury = new Treasury(0, 0);

        this.units = [];

        this.unitPointer = 0;
        this.matrix = [];
        for (let i = 0; i < utils.WIDTH; i++) {
            let column = [];
            for (let j = 0; j < utils.HEIGHT; j++) {
                column.push(null);
            }
            this.matrix.push(column);
        }

        let whiteKing = new King(new utils.Point(0, Math.floor(utils.HEIGHT / 2)), utils.WHITE);
        let blackKing = new King(new utils.Point(utils.WIDTH - 1, Math.floor(utils.HEIGHT / 2)), utils.BLACK);
        this.placeUnit(whiteKing);
        this.placeUnit(blackKing);

        this.whiteKing = whiteKing;
        this.blackKing = blackKing;
    }

    initialize() {
        let whitePeasant = new Peasant(new utils.Point(1, Math.floor(utils.HEIGHT / 2)), utils.WHITE);
        let blackPeasant = new Peasant(new utils.Point(utils.WIDTH - 2, Math.floor(utils.HEIGHT / 2)), utils.BLACK);
        this.placeUnit(whitePeasant);
        this.placeUnit(blackPeasant);


        let whiteBuilder1 = new Builder(new utils.Point(0, Math.floor(utils.HEIGHT / 2) - 1), utils.WHITE);
        let whiteBuilder2 = new Builder(new utils.Point(0, Math.floor(utils.HEIGHT / 2) + 1), utils.WHITE);

        let blackBuilder1 = new Builder(new utils.Point(utils.WIDTH - 1, Math.floor(utils.HEIGHT / 2) - 1), utils.BLACK);
        let blackBuilder2 = new Builder(new utils.Point(utils.WIDTH - 1, Math.floor(utils.HEIGHT / 2) + 1), utils.BLACK);

        this.placeUnit(whiteBuilder1);
        this.placeUnit(blackBuilder1);

        this.placeUnit(whiteBuilder2);
        this.placeUnit(blackBuilder2);
    }

    getCurrentUnit() {
        return this.units[this.unitPointer];
    }

    placeUnit(unit) {
        if (this.matrix[unit.position.x][unit.position.y] !== null) {
            throw new utils.Exception("The cell is occupied");
        }
        this.units.push(unit);
        this.matrix[unit.position.x][unit.position.y] = unit;
    }

    killUnit(unit) {
        this.matrix[unit.position.x][unit.position.y] = null;
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
            if (this.matrix[x][y] === null) {
                throw new utils.Exception("Invariant violated: matrix is null");
            }
        }

        let matrixUnitCount = 0;
        for (let i = 0; i < utils.WIDTH; i++) {
            for (let j = 0; j < utils.HEIGHT; j++) {
                if (this.matrix[i][j] !== null) {
                    matrixUnitCount++;
                }
            }
        }

        if (matrixUnitCount !== this.units.length) {
            throw new utils.Exception("Unit counts are not the same");
        }
    }

    getCampZone(color) {
        let res = [];
        if (color === utils.WHITE) {
            for (let i = 0; i < utils.CAMP_WIDTH; i++) {
                for (let j = 0; j < utils.HEIGHT; j++) {
                    if (this.matrix[i][j] === null) {
                        res.push(new utils.Point(i, j));
                    }
                }
            }
        }

        if (color === utils.BLACK) {
            for (let i = utils.WIDTH - 1; i >= utils.WIDTH - utils.CAMP_WIDTH; i--) {
                for (let j = 0; j < utils.HEIGHT; j++) {
                    if (this.matrix[i][j] === null) {
                        res.push(new utils.Point(i, j));
                    }
                }
            }
        }

        return res;
    }

    genMovesForCurrentUnit(){
        return this.getCurrentUnit().generateMoves(this);
    }

    static unitToString(unit) {
        let res = "";
        if (unit instanceof King && unit.color === utils.WHITE) {
            res += 'K';
        }

        if (unit instanceof King && unit.color === utils.BLACK) {
            res += 'k';
        }

        if (unit instanceof Peasant && unit.color === utils.WHITE) {
            res += 'P';
        }

        if (unit instanceof Peasant && unit.color === utils.BLACK) {
            res += 'p';
        }

        if (unit instanceof GoldMine && unit.color === utils.WHITE) {
            res += 'G';
        }

        if (unit instanceof GoldMine && unit.color === utils.BLACK) {
            res += 'g';
        }

        if (unit instanceof StoneMine && unit.color === utils.WHITE) {
            res += 'S';
        }

        if (unit instanceof StoneMine && unit.color === utils.BLACK) {
            res += 's';
        }

        if (unit instanceof Barrack && unit.color === utils.WHITE) {
            res += 'H';
        }

        if (unit instanceof Barrack && unit.color === utils.BLACK) {
            res += 'h';
        }

        if (unit instanceof Builder && unit.color === utils.WHITE) {
            res += 'B';
        }

        if (unit instanceof Builder && unit.color === utils.BLACK) {
            res += 'b';
        }

        if (unit instanceof Archer && unit.color === utils.WHITE) {
            res += 'A';
        }

        if (unit instanceof Archer && unit.color === utils.BLACK) {
            res += 'a';
        }

        return res;
    }

    toString() {
        let res = "";

        for (let i = 0; i < this.units.length; i++) {
            if (this.unitPointer === i) {
                res += '|';
            }
            else {
                res += "-";
            }
        }
        res += "\n";

        for (let i = 0; i < this.units.length; i++) {
            res += Game.unitToString(this.units[i]);
        }

        res += "\n\n";

        for (let i = 0; i < utils.WIDTH; i++) {
            for (let j = 0; j < utils.HEIGHT; j++) {
                let unit = this.matrix[i][j];
                if (unit === null) {
                    res += '.';
                }
                else {
                    res += Game.unitToString(unit);

                }
            }
            res += "\n";
        }
        return res;
    }

    assignMove(move) {
        if (move instanceof IdleMove) {
            //do nothing;
        }

        if (move instanceof RelocationMove) {
            let startX = move.start.x;
            let startY = move.start.y;
            let endX = move.end.x;
            let endY = move.end.y;
            let unit = null;
            if (this.matrix[startX][startY] === null) {
                throw new utils.Exception("Starting point is empty");
            }
            else {
                unit = this.matrix[startX][startY];

                if (unit !== this.getCurrentUnit()) {
                    throw new utils.Exception("Moving unit is not the current one");
                }
            }

            for (let i = 0; i < move.intermediate.length; i++) {
                let x = move.intermediate[i].x;
                let y = move.intermediate[i].y;
                if (this.matrix[x][y] !== null) {
                    throw new utils.Exception("Intermediate point is not empty");
                }
            }

            if (this.matrix[endX][endY] !== null) {
                let anotherUnit = this.matrix[endX][endY];
                if (anotherUnit.color === unit.color) {
                    throw new utils.Exception("You can't take your own unit");
                }
                this.killUnit(anotherUnit);
            }

            this.moveUnit(unit, move.end);
        }

        if (move instanceof ShootingMove) {
            let startX = move.start.x;
            let startY = move.start.y;
            if (this.matrix[startX][startY] === null) {
                throw new utils.Exception("Starting point is empty");

                if (this.matrix[startX][startY] !== this.getCurrentUnit()) {
                    throw new utils.Exception("Moving unit is not the current one");
                }
            }

            var targetX = move.target.x;
            var targetY = move.target.y;
            if (this.matrix[targetX][targetY] !== null) {
                this.killUnit(this.matrix[targetX][targetY]);
            }
        }

        if (move instanceof BuildingMove) {
            this.placeUnit(move.unit);
            if (move.unit.color === utils.WHITE) {
                this.whiteTreasury.gold -= move.priceGold;
                this.whiteTreasury.stone -= move.priceStone;
            }

            if (move.unit.color === utils.BLACK) {
                this.blackTreasury.gold -= move.priceGold;
                this.blackTreasury.stone -= move.priceStone;
            }
        }

        if (move instanceof IncomeMove) {
            var plusGold = move.plusGold;
            var plusStone = move.plusStone;
            var color = move.color;
            if (color === utils.WHITE) {
                this.whiteTreasury.gold += plusGold;
                this.whiteTreasury.stone += plusStone;
            }
            if (color === utils.BLACK) {
                this.blackTreasury.gold += plusGold;
                this.blackTreasury.stone += plusStone;
            }
        }

        this.unitPointer++;
        if (this.unitPointer === this.units.length) {
            this.unitPointer = 0;
        }

        if (DEBUG) {
            this.checkInvariants();
        }
    }
}

module.exports = Game;