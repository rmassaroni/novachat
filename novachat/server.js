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

var channels = [];
var userNumber = 0;
var activeUsers = []; //identifies users by numbers for now until we have a proper database.

app.use(express.static(join(__dirname, 'build')));
io.on('connection', (socket) => {
    console.log("user connected: ", socket.id);
    activeUsers.push(socket.id);
    userNumber++;
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
    newChannel(wifiname);

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
    socket.on('server message', (msg) => {
        //server messages will only be displayed to individuals?
        io.emit('server message', msg);
    });
    socket.on('wifi', (w) => {
        io.emit('wifi', w);
        socket.emit('message', w);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
        //delete room if zero users are connected
        userNumber--;
        activeUsers = [...activeUsers.slice(0, activeUsers.indexOf(socket.id)), ...activeUsers.slice(activeUsers.indexOf(socket.id) + 1)];
    });

    socket.emit('user number', socket.id);
    socket.emit('message', wifiname);
    socket.emit('server message', "server message test");
    socket.emit('wifi', wifiname);
    console.log('channels: ', channels);
    console.log('active users: ',activeUsers);
    socket.emit('server message', userNumber+" active user(s)");
    socket.emit('join room', "test room");
});

//app.use(express.static(join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'public', 'index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});

let wifiname = "";
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
        wifiname = stdout.trim();

        console.log(wifiname);
    });

});

module.exports = server;
