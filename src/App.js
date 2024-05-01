//import logo from './logo.svg';
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";

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
	    const IP = '35.236.242.246:8443';
	    const URL = "https://"+IP+"/";
        //socketRef.current = io("http://localhost:3000");
	    //socketRef.current = io('http://172.21.70.97:3000'); //for multi user testing
	    //socketRef.current = io("https://novachat-b6eea.web.app/");
	    //socketRef.current = io("http://35.199.26.16:3000/");
	    //socketRef.current = io("https://35.199.26.16:8443/", {
	    //socketRef.current = io.connect("https://34.150.225.106:8443/", {
	    socketRef.current = io.connect(URL, {
		    withCredentials: true,
		    extraHeaders: {
			    "my-custom-header": "abcd"
		    }
	    });

        socketRef.current.on("connect", () => {
            console.log("Connected to server");
        });
        socketRef.current.on("user number", (num) => {
            //myUserNumber = num;
            setMyUserNumber(num);
            sendServerMessage("User Number: " + num);
        });
        socketRef.current.on("join room", (room) => {
            roomUpdate(room);
            sendServerMessage("myChannels: " + myChannels);
        });
        socketRef.current.on("message", (msg) => {
            send(msg);
        });
        socketRef.current.on("server message", (msg) => {
            sendServerMessage(msg);
        });
        socketRef.current.on("wifi", (wifi) => {
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
        if (msg !== "") {
            setMessages((prevMessages) => [...prevMessages, msg]);
        } else {
            if (newMessage.trim() !== "") {
                socketRef.current.emit("message", newMessage);
                setNewMessage("");
            } else {
                socketRef.current.emit("message", "empty message");
                setNewMessage("");
            }
        }
    };
    const sendChatMessage = () => {
        if (newMessage.trim() !== "") {
            socketRef.current.emit("message", myUserNumber + ": " + newMessage);
            setNewMessage("");
        } else {
            socketRef.current.emit("message", myUserNumber + ": empty message");
            setNewMessage("");
        }
    };
    //dan, heres something for you to do.  create red messages.
    const sendServerMessage = (msg) => {
        send("SERVER: " + msg);
    };
    //const socket = io('http://localhost:3000');

    const containerRef = useRef(null);
    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendChatMessage();
        const container = containerRef.current;
        if (!container) return;

        const pageWidth = container.clientWidth;
        const scrollAmount = pageWidth;
        if (e.key === "j") {
            // use `ArrowLeft` instead of `j` and `ArrowRight` instead of `k` eventually
            container.scrollLeft -= scrollAmount;
        } else if (e.key === "k") {
            container.scrollLeft += scrollAmount;
        }
    };

    function setWifiHeader(wifi) {
        var wifiHeader = document.getElementById("wifi-header");
        wifiHeader.textContent = "WiFi Channel: " + wifi;
        //setMessages(prevMessages => [...prevMessages, 'Joined: '+wifi]);
    }

    return (
        <div>
            <div className="App-header">
                <h1 class="small-padding">novachat</h1>
            </div>

            <div
                className="container"
                ref={containerRef}
                tabIndex="0"
                onKeyDown={handleKeyPress}
            >
                <div className="page">
                    <h1 id="wifi-header">WiFi Channel: </h1>
                    <ul class="messages">
                        {messages.map((msg, index) => (
                            <li key={index}>{msg}</li> // Render each message in the list
                        ))}
                    </ul>
                    {/*<button onClick={handleSendMessage}>Send</button> {/* Add a button to send the message */}
                    <div class="form" action="">
                        <input
                            class="input"
                            autocomplete="off"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Message"
                        />
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
