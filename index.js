var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('static'));

var clients = {};

var logClients = function () {
    for (var client in clients) {
        console.log('\t' + client);
    }
};

io.on('connection', function(socket){
    console.log('a user connected');
	socket.on('name', function(init) {
        clients[init.name + init.type] = socket;
        // Show the clients currently connected
        logClients();
        socket.on('disconnect', function(data) {
            console.log(init.name, init.type, 'disconnected');
            delete clients[init.name + init.type];
        });
        socket.on('heartbeat', function(data) {
            if (clients.hasOwnProperty(init.name + 'client')) {
                clients[init.name + 'client'].emit('heartbeat', data);
            }
        });
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

