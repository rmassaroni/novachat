const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path')
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.join('new room');
    console.log(socket.rooms);
    //socket.emit(socket.rooms);
    //io.emit('hello');
    socket.on('global message', (msg) => {
        console.log('global message: ' + msg)
        io.emit('global message', msg)
    });

    

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.emit('chat message', 'chat message')
    socket.emit('global message', 'global message');

});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
