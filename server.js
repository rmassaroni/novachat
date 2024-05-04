const express = require('express');
const https = require('https');
const { join } = require('node:path')
const { Server } = require('socket.io');
const app = express();
const cors = require('cors');
const fs = require('fs');

const privateKey = fs.readFileSync('server.key', 'utf8');
const certificate = fs.readFileSync('server.cert', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const firebase = require('firebase-admin');
//const serviceAccount = require('./novachat-b6eea-firebase-adminsdk-2rbye-eb98c2d26a.json');
//firebase.initializeApp({
//    credential: firebase.credential.cert(serviceAccount),
//    databaseURL: 'https://novachat-b6eea.web.app'
//});
//if (Object.keys(serviceAccount).length === 0 && serviceAccount.constructor === Object) {
//    console.error('Failed to require service account key. Make sure the path is correct.');
//} else {
//    console.log('Service account key required successfully.');
//}

app.use(cors({
	origin: ['https://novachat-b6eea.web.app/', 'https://nova-chat.com']
	//origin: 'https://novachat-b6eea.web.app'
	//origin: 'https://nova-chat.com'
}));
app.use(function(req, res, next) {
	//res.header('Access-Control-Allow-Origin', 'https://nova-chat.com');
	//res.header('Access-Control-Allow-Origin', ['https://novachat-b6eea.web.app', 'https://nova-chat.com']);
	res.header('Access-Control-Allow-Origin', 'https://novachat-b6eea.web.app');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

	next();
});


const PORT = 8443;
const httpsServer = https.createServer(credentials, app).listen(PORT, '0.0.0.0', () => {
    console.log('Server running on port '+PORT);
});
const httpsIO = require("socket.io")(httpsServer, {
  cors: {
    //origin: "https://nova-chat.com",
	  origin: ["https://novachat-b6eea.web.app", "https://nova-chat.com"],
	//origin: 'https://novachat-b6eea.web.app',
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});


var channels = [];
var userNumber = 0;
var activeUsers = []; //identifies users by numbers for now until we have a proper database.

 app.use(express.static(join(__dirname, 'build')));
//app.use(express.static('public'));
httpsIO.on('connection', (socket) => {
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
	    console.log(msg);
        httpsIO.emit('message', msg);
    });
    socket.on('server message', (msg) => {
        //server messages will only be displayed to individuals?
        httpsIO.emit('server message', msg);
    });
    socket.on('wifi', (w) => {
        httpsIO.emit('wifi', w);
        socket.emit('message', w);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
        //delete room if zero users are connected
        userNumber--;
        activeUsers = [...activeUsers.slice(0, activeUsers.indexOf(socket.id)), ...activeUsers.slice(activeUsers.indexOf(socket.id) + 1)];
    });

    socket.emit('socket id', socket.id);
	socket.emit('user count', activeUsers.length);
    console.log('active users: ',activeUsers);
    socket.emit('server message', userNumber+" active user(s)");
    socket.emit('join room', "dev_room");
});

//app.use(express.static(join(__dirname, 'public')));
//app.get('/', (req, res) => {
//    res.sendFile(join(__dirname, 'public', 'index.html'));
//});
//app.get('*', (req, res) => {
//    res.sendFile(join(__dirname, 'build', 'index.html'));
//});

let wifiname = "";
//const { exec } = require('child_process');
//const command = 'powershell.exe -Command "Get-NetConnectionProfile | Select-Object -ExpandProperty Name"';


//server.listen(3000, '0.0.0.0', () => {
//const PORT = process.env.PORT || 3000;
//server.listen(PORT, () => {
//    console.log('server running at http://localhost:3000');
//    console.log(server.address);
//    exec(command, (error, stdout, stderr) => {
//        if (error) {
//            console.error(`Error: ${error.message}`);
//            return;
//        }
//        if (stderr) {
//            console.error(`stderr: ${stderr}`);
//            return;
//        }
//        wifiname = stdout.trim();
//        console.log(wifiname);
//    });

//});

module.exports = httpsServer;
