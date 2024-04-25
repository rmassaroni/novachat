//import logo from './logo.svg';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
    const socketRef = useRef();
    //var myUserNumber = -1;
    const [myUserNumber, setMyUserNumber] = useState(-1);
    var myChannels = ["Global"];
    const roomUpdate = (newRoom) => {
        //myChannels = [...myChannels, newRoom];
        myChannels.push(newRoom);
    };
    useEffect(() => {
        socketRef.current = io('http://localhost:3000');
        //socketRef.current = io('http://172.21.70.97:3000'); //for multi user testing
        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });
        socketRef.current.on('user number', (num) => {
            //myUserNumber = num;
            setMyUserNumber(num);
            sendServerMessage('User Number: '+num);
        });
        socketRef.current.on('join room', (room) => {
            
            roomUpdate(room);
            sendServerMessage("myChannels: "+ myChannels);
        })
        socketRef.current.on('message', (msg) => {
            send(msg);
        });
        socketRef.current.on('server message', (msg) => {
            sendServerMessage(msg);
        });
        socketRef.current.on('wifi', (wifi) => {
            setWifiHeader(wifi);
            roomUpdate(wifi);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const send = (msg = "") => {
        if(msg != "") {
            setMessages(prevMessages => [...prevMessages, msg]);
        }
        else {
            if (newMessage.trim() !== "") {
                socketRef.current.emit('message', newMessage);
                setNewMessage("");
            }
            else {
                socketRef.current.emit('message', "empty message");
                setNewMessage("");
            }
        }
    }
    const sendChatMessage = () => {
        if (newMessage.trim() !== "") {
            socketRef.current.emit('message', myUserNumber+": "+newMessage);
            setNewMessage("");
        }
        else {
            socketRef.current.emit('message', myUserNumber+": empty message");
            setNewMessage("");
        }
    }
    //dan, heres something for you to do.  create red messages.
    const sendServerMessage = (msg) => {

        send("SERVER: "+msg);
    }
    //const socket = io('http://localhost:3000');

    const containerRef = useRef(null);
    const handleKeyPress = (e) => {
        if (e.key === "Enter")
            sendChatMessage();
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

    function setWifiHeader(wifi) {
        var wifiHeader = document.getElementById('wifi-header');
        wifiHeader.textContent = "WiFi Channel: " + wifi;
        //setMessages(prevMessages => [...prevMessages, 'Joined: '+wifi]);
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
                        <input 
                            type="text" 
                            className="input-class" 
                        />
                    </div>
                </header>

            </div>

            <div className="container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyPress}>
                <div className="page">
                    <h1 id="wifi-header">WiFi Channel: </h1>
                    <ul class="messages">
                        {messages.map((msg, index) => (
                            <li key={index}>{msg}</li> // Render each message in the list
                        ))}

                    </ul>
                    {/*<button onClick={handleSendMessage}>Send</button> {/* Add a button to send the message */}
                    <div class="form" action="">
                        <input class="input" autocomplete="off" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} 
                        /><button onClick={send}>Send</button>
                    </div>


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