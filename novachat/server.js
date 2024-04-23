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

let channels = [];

app.use(express.static(join(__dirname, 'build')));
io.on('connection', (socket) => {
    console.log("user connected");
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
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.on('getWifi', () => {
        console.log(wifiname);
        io.emit('wifi', wifiname);
    });
    socket.emit('message', 'test');
    console.log(channels);
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
