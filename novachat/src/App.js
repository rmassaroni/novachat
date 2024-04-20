import logo from './logo.svg';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
    /*
    const socketRef = useRef();
    useEffect(() => {
        socketRef.current = io('http://localhost:3000');
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });
        socketRef.current.on('message', (msg) => {
            console.log('Received message:', msg);

            setMessages(prevMessages => [...prevMessages, msg]);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    const [messages, setMessages] = useState([]); // State to hold messages
    const [newMessage, setNewMessage] = useState(""); // State to hold new message>
    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            socketRef.current.emit('message', newMessage); // Emit the new message
            setNewMessage(""); // Clear the input field
        }
        else {
            socketRef.current.emit('message', "test");
            setNewMessage("");
        }
        console.log('message')
    };
    */

    const socket = io('http://localhost:3000');

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
                        {/*
                        <input 
                            type="text" 
                            className="input-class" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)} 
                        />
                        */}
                    </div>
                </header>

            </div>
            {/*
            <button onClick={handleSendMessage}>Send</button> {/* Add a button to send the message */}
            <div className="container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyPress}>
                <div className="page">
                    <h1>WiFi Channel: </h1>
                    <ul class="messages">
                        <li>test</li>
                        <li>test2</li>
                        {/* }{messages.map((msg, index) => (
                                <li key={index}>{msg}</li> // Render each message in the list
                            ))}
                        */}
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
