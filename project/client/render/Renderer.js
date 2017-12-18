var WIDTH = 1200;
var HEIGHT = 800;

var TOP_OFFSET = 100;
var SIDE_OFFSET = 200;


function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


class Renderer{
    getTileGeometry(x, y){
        var actualHeight = HEIGHT - 2 * TOP_OFFSET;
        var actualWidth = WIDTH - 2 * SIDE_OFFSET;

        var actualK = actualWidth / actualHeight;
        var mapK = this.mapWidth / this.mapHeihgt;

        var fieldWidth = null;
        var fieldHeight = null;
        var additionalSideOffset = 0;
        var additionalTopOffset = 0;

        if(mapK <= actualK){
            additionalSideOffset = (actualK - mapK)/2 * actualHeight;
            fieldWidth = actualWidth - additionalSideOffset * 2;
            fieldHeight = actualHeight;
        }
        else{
            additionalTopOffset = (mapK - actualK)/2 * actualWidth;
            fieldWidth = actualWidth;
            fieldHeight = actualHeight - additionalTopOffset * 2;
        }

        var size = fieldWidth / this.mapWidth;
        var anotherSize = fieldHeight / this.mapHeihgt;
        console.log(size, anotherSize);

        var centerX = SIDE_OFFSET + additionalSideOffset + size * (x + 0.5);
        var centerY = TOP_OFFSET + additionalTopOffset + size * (y + 0.5);

        return {x : centerX, y:centerY, size:size};
    }

    appendUnit(unit){
        this.unitMap.set(unit.id, unit);
        var geometry = this.getTileGeometry(unit.position.x, unit.position.y);
        var tile = PIXI.Sprite.fromImage(getPicOfUnit(unit));
        tile.anchor.set(0.5);
        tile.x = geometry.x;
        tile.y = geometry.y;
        tile.width = geometry.size;
        tile.height = geometry.size;
        this.app.stage.addChild(tile);
        this.tileMap.set(unit.id, tile);
    }

    moveUnit(unit, from, to){
        var geometry = this.getTileGeometry(to.x, to.y);
        var unit = this.unitMap.get(unit.id);
        var tile = this.tileMap.get(unit.id);

        tile.x = geometry.x;
        tile.y = geometry.y;
        sleep(200);
    }

    constructor(game){
        this.mapWidth = game.map.width;
        this.mapHeihgt = game.map.height;

        this.app = new PIXI.Application(WIDTH, HEIGHT, {backgroundColor: 0x1099bb});
        document.body.appendChild(this.app.view);
        this.unitMap = new Map();
        this.tileMap = new Map();


        for(var i = 0; i<game.units.length; i++){
            this.appendUnit(game.units[i]);
        }
    }


}