import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function App() {
    const socketRef = useRef();
    const usernames = [];
    var username1 = "user";
    const [username, setUsername] = useState(null);
    const [sidebar, setSidebar] = useState(false);
    var myChannels = ["Global"];
    const roomUpdate = (newRoom) => {
        //myChannels = [...myChannels, newRoom];
        myChannels.push(newRoom);
    };
    useEffect(() => {
        socketRef.current = io("http://localhost:3000");
        //socketRef.current = io('http://172.21.70.97:3000'); //for multi user testing
        //socketRef.current = io("https://novachat-b6eea.web.app/");

        socketRef.current.on("connect", () => {
            console.log("Connected to server");
            var id = Math.floor(Math.random() * 9000) + 1000; // random four digit number
            setUsername("user" + id); // set a random username
            username1 += id;
            usernames.push(username1);
            sendServerMessage("Username: " + username1);
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
            }
            // } else {
            //     socketRef.current.emit("message", "empty message");
            //     setNewMessage("");
            // }
        }
    };
    const sendChatMessage = () => {
        if (newMessage.trim() !== "") {
            socketRef.current.emit("message", username + ": " + newMessage);
            setNewMessage("");
        }
        // } else {
        //     socketRef.current.emit("message", username + ": empty message");
        //     setNewMessage("");
        // }
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

        // NOTE: TEMP REMOVED SCROLLING
        // const pageWidth = container.clientWidth;
        // const scrollAmount = pageWidth;
        // if (e.key === "j") {
        //     // use `ArrowLeft` instead of `j` and `ArrowRight` instead of `k` eventually
        //     container.scrollLeft -= scrollAmount;
        // } else if (e.key === "k") {
        //     container.scrollLeft += scrollAmount;
        // }
    };

    function setWifiHeader(wifi) {
        var wifiHeader = document.getElementById("wifi-header");
        wifiHeader.textContent = "WiFi Channel: " + wifi;
        //setMessages(prevMessages => [...prevMessages, 'Joined: '+wifi]);
    }

    return (
        <div>
            <div
                className="App-header"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <input
                    style={{ width: "50px", height: "50px", padding: "10px" }}
                    type="image"
                    src="https://cdn-icons-png.flaticon.com/128/10486/10486773.png"
                    onClick={() => setSidebar(!sidebar)}
                />
                <h1 class="small-padding">novachat</h1>
                <h1></h1>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <Sidebar collapsed={sidebar} collapsedWidth="0px">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <h3 style={{ paddingLeft: 10 }}>Channels</h3>
                        <input
                            style={{ width: "25px", height: "25px", padding: "20px" }}
                            type="image"
                            src="https://cdn-icons-png.flaticon.com/128/992/992651.png"
                        />
                    </div>
                    <Menu>
                        {
                            myChannels.map((channel) => (
                                <MenuItem>{channel}</MenuItem>
                            )) // List all the channels
                        }
                    </Menu>
                </Sidebar>

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
                </div>
            </div>
        </div>
    );
}

export default App;
