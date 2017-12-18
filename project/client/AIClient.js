var io = require('socket.io-client');
var socket = io.connect('http://localhost:4000', {reconnect: true});
var moi = this;
this.me = null;


socket.on('connect', function (socket) {
    console.log('Connected!');
});

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

socket.on("action", function (action) {
    console.log("Action", action);
    sleep(1000);

    if(action.type === "Your move"){
        console.log("Emit 0");
        socket.emit("answer", {type : "Move", index : 0});
    }
    else{
        console.log("Emit response");
        socket.emit("answer",  {type : "Response"})
    }
});