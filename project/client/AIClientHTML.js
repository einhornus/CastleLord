var renderer = null;

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

window.onload = function() {
    console.log("Load");
    var socket = io.connect('localhost:4000');
    console.log("Connected");


    socket.on("action", function (action) {
        if(action.type === "Init game"){
            renderer = new Renderer(action.game);
        }
        else{
            if(action.type === "Move unit"){
                if(renderer !== null) {
                    renderer.moveUnit(action.unit, action.from, action.to);
                }
            }
        }

        console.log("Action", action);

        if(action.type === "Your move"){
            sleep(300);
            console.log("Emit 0");
            socket.emit("answer", {type : "Move", index : 0});
        }
        else{
            console.log("Emit response");
            sleep(100);
            socket.emit("answer",  {type : "Response"})
        }
    });
};



