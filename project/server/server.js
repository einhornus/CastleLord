Server = require("./server/Server");

var express = require('express');
var app = express();

let server =  new Server(app);
