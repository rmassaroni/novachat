const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path')
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

let channels = [];

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    function newChannel(roomName) {
        for(room in socket.rooms) {
            console.log(room);
            if(channels.includes(room) == false) {
                channels.push(room);
            }
        }
        if(channels.includes(roomName) == false) {
            channels.push(roomName);
        }
        socket.join(roomName);
    };
    console.log('a user connected');
    newChannel(wifiName);
    //socket.join('new room');
    //console.log(socket.rooms);
    //socket.emit(socket.rooms);
    //io.emit('hello');
    socket.on('global message', (msg) => {
        console.log('global message: ' + msg);
        io.emit('global message', msg)
    });

    socket.on('server message', (msg) => {
        console.log('server message: ' + msg);
        io.emit('server message', msg);
    });
    socket.on('wifi message', (msg) => {
        console.log('wifi message: ' + msg);
        io.emit('wifi message', msg);
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        //delete room if zero users are connected
    });

    socket.emit('chat message', 'chat message')

    socket.emit('server message', 'Welcome. Connected to: ' + wifiName);
    console.log(channels)
    console.log(socket.rooms);
    //console.log(io.sockets.adapter.rooms);

});

//wifi info
let wifiName = "";
const { exec } = require('child_process');
const command = 'powershell.exe -Command "Get-NetConnectionProfile | Select-Object -ExpandProperty Name"';


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        //console.log(`Wi-Fi name: ${stdout}`);
        wifiName = stdout.trim();
    });
});
