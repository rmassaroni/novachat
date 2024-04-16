const { Server } = require("socket.io");

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path')

const app = express();
const server = createServer(app);

app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});
