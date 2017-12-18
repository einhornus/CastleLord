var app;

function clear() {
    for (var i = app.stage.children.length - 1; i >= 0; i--) {
        app.stage.removeChild(app.stage.children[i]);
    }
}

function render(game) {
    console.log("render!");

    actualPic = picDic[0];
    var bunny = PIXI.Sprite.fromImage(actualPic);
    bunny.anchor.set(0.5);
    bunny.x = app.renderer.width / 2;
    bunny.y = app.renderer.height / 2;
    app.stage.addChild(bunny);
}

function init(game) {
    var width = 1200;
    var height = 800;

    app = new PIXI.Application(width, height, {backgroundColor: 0x1099bb});
    document.body.appendChild(app.view);

    app.ticker.add(function (delta) {
        clear();
        render();
    });


    for(var i = 0; i<game.map.width; i++){
        for(var j = 0; j<game.map.height; j++){

        }
    }
}

let game = new Game();
console.log(game);
init();