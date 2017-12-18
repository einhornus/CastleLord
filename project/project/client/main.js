console.log(Lib);

width = 1200;
height = 800;

//init();

var world = new Lib.World();
var port = 3000;
var socket = io.connect('http://localhost:' + port);
socket.on('world', function (w) {
    world = w;
    console.log(Lib.getMethods(world));
    console.log(world);
});

socket.on('meh', function (w) {
    console.log(w)
    console.log(w(3, 4))
});