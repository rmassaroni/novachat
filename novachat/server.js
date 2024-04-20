//following imports are from original index.js. still figuring out where they should be
const express = require('express');
//const { createServer } = require('node:http');
const http = require('http');
//const { join } = require('node:path')
const { join } = require('path');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

//socket stuff from original index.js
//app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    //res.sendFile(join(__dirname, 'index.html'));
//});
app.use(express.static(join(__dirname, 'build')));
io.on('connection', (socket) => {
    console.log("user connected");
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.emit('message', 'test');
});

//app.use(express.static(join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});

module.exports = server;