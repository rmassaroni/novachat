import logo from './logo.svg';
import React, { useRef } from 'react';
import './App.css';

//following imports are from original index.js. still figuring out where they should be
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path')
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);

//socket stuff from original index.js
let channels = [];
app.get('/', (req, res) => {
    //res.send('<h1>Hello world</h1>');
    res.sendFile(join(__dirname, 'index.html'));
});
io.on('connection', (socket) => {
    console.log("user connected");
    socket.on('message', (msg) => {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    socket.emit('message', 'test');
});



function App() {
    const containerRef = useRef(null);
    const handleKeyPress = (e) => {
        const container = containerRef.current;
        if (!container) return;

        const pageWidth = container.clientWidth;
        const scrollAmount = pageWidth;
        if (e.key === 'j') {
            container.scrollLeft -= scrollAmount;
        } else if (e.key === 'k') {
            container.scrollLeft += scrollAmount;
        }
    };
    return (

        <div>
            <div className="App-header">
                <header className="App-header">
                    {/* <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload. test
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                */}
                    <h1 class="small-padding">novachat</h1>
                    <div className="line">
                        <p1 class="server-message">Server Messages: </p1>
                        <div class="divider"></div>
                        <input type="text" className="input-class" />
                    </div>
                </header>

            </div>
            <div className="container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyPress}>

                <div className="page">
                    <h1>WiFi Channel: </h1>
                    <ul class="messages">
                        <li>test</li>
                        <li>test2</li>
                    </ul>
                </div>
                <div className="page">
                    <h1>Chatroom Example</h1>
                </div>
                <div className="page">
                    <h1>Global Channel</h1>
                </div>
            </div>
        </div>
    );
}

export default App;
