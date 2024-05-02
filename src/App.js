import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

function App() {
    const CONNECTED = false;
    const socketRef = useRef();
    const usernames = [];
    const [username, setUsername] = useState("user");
    const [sidebar, setSidebar] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [serverStatus, setServerStatus] = useState("unable to connect to server")
    const roomUpdate = (newRoom) => { setMyChannels((prevChannels) => [...prevChannels, newRoom]); };
    var username1 = "user";
    //var myChannels = ["Global"];
    const [myChannels, setMyChannels] = useState(["Global"]);
    var currentUsername;

    useEffect(() => {
        const IP = '35.236.242.246';
        const PORT = '8443';
        const URL = "https://"+IP+":"+PORT+"/";
        const connectToServer = async () => {
            try {
                console.log("Connecting to server...");
                await fetch(URL);
                //socketRef.current = io("http://localhost:3000"); //use this for testing on local host. would need to redownload all the old modules.
                socketRef.current = io.connect(URL);
                socketRef.current.on("connect", () => {
                    console.log("Connected to server");
                    var id = Math.floor(Math.random() * 9000) + 1000; // random four digit number
                    setUsername("user" + id); // set a random username
                    username1 += id;
                    usernames.push(username1);
                    setServerStatus("connected to server");
                });
                socketRef.current.on("socket id", (sid) => {
                    setUsername(sid);
                    currentUsername = sid;
                    
                    sendServerMessage("Your default username: " + currentUsername);
                })
                socketRef.current.on("join room", (room) => {
                    roomUpdate(room);
                });
                socketRef.current.on("message", (msg) => {
                    if(msg.startsWith(currentUsername + ":") == false)
                        send(msg);
                });
                socketRef.current.on("server message", (msg) => {
                    sendServerMessage(msg);
                });
                socketRef.current.on("wifi", (wifi) => {
                    setWifiHeader(wifi);
                    roomUpdate(wifi);
                });
                socketRef.current.on("server status", (status) => {
                    console.log("set server status");
                    document.getElementById("server-status").innerText = status;
                });
            } catch (error) {
                console.error("ERROR connecting to server: \n" + "URL:", URL + "\nMESSAGE:", error.message);
                sendServerMessage("ERROR connecting to server. Try this URL: " + URL); //make url clickable
            }
        };
        connectToServer();
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const send = (msg = "") => {
        if (msg !== "") {
            setMessages((prevMessages) => [...prevMessages, msg]);
        } else if (newMessage.trim() !== "") {
                socketRef.current.emit("message", newMessage);
                setNewMessage("");
        }
    };

    const sendChatMessage = () => {
        if (newMessage.trim() !== "") {
            socketRef.current.emit("message", username + ": " + newMessage);
            const formattedMsg = <p className="messages"><strong>{username}:</strong> {newMessage.trim()}</p>

            setMessages((prevMessages) => [...prevMessages, formattedMsg]);
            setNewMessage("");
        }
        // } else {
        //     socketRef.current.emit("message", username + ": empty message");
        //     setNewMessage("");
        // }
    };

    const sendServerMessage = (msg) => {
        //send(msg);
        const formattedMsg = <p className="server-message">{msg}</p>;
        setMessages((prevMessages) => [...prevMessages, formattedMsg]);
    };

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
        wifiHeader.textContent = "Global: " + wifi;
        //setMessages(prevMessages => [...prevMessages, 'Joined: '+wifi]);
    }


    const renderMessage = (msg, index) => {
        return (
            <li key={index} className={msg.startsWith("SERVER") ? "server-message" : ""}>
                {msg}
            </li>
        );
    };

    return (
        <div>
            <div
                className="App-header"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: "10px",
                    height: "70px",
                }}
            >
                <div class="line">
                    <input
                        style={{ width: "50px", height: "50px", padding: "10px", marginTop: "15px", paddingRight: "15px" }}
                        type="image"
                        alt="sidebar icon"
                        src="https://cdn-icons-png.flaticon.com/128/10486/10486773.png"
                        onClick={() => setSidebar(!sidebar)}
                    />

                    <div class="line">
                        <h2>Channel: Global</h2>
                    </div>
                </div>

                
{/*
                <div class="trapezoid" style={{
                    fontSize: "50px",
                }}>
                    <h1 class="trapezoid-text">
                    novachat</h1> </div>
*/}
                <div style={{ position: "relative", display: "inlineBlock"}}>
                    <img style={{ marginTop: "38px" }}src="/banner.png" alt="novachat banner" />
                    <h1 style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        padding: "1px",
                        fontSize: "3.6em",
                        marginTop: "6px"
                    }}>
                        novachat
                    </h1>

                </div>
                <div class="line" style={{justifyContent: "flex-end"}}>
                    <div class="line">
                        <h2 style={{ paddingRight: "15px" }}>Chatting as: </h2>
                    </div>
                    <img style={{ width: "50px", height: "50px", padding: "0px", marginTop: "25px", borderRadius: "10px", border: "1px solid #ccc" }} src="/nova.jpg" alt="nova icon" />
                </div>
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
                            alt="add channel icon"
                            src="https://cdn-icons-png.flaticon.com/128/992/992651.png"
                            onClick={() => {
                                const c = prompt("Enter channel name to join/create:");
                                if (c !== null && c.trim() !== "") roomUpdate(c);
                            }}
                        />
                    </div>
                    <Menu>
                        {
                            myChannels.map((channel) => (
                                <MenuItem
                                    component={
                                        <p
                                            onClick={() => {
                                                console.log("Joining channel: " + channel);
                                            }}
                                        />
                                    }
                                >
                                    {channel}
                                </MenuItem>
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
                        <div class="line" style={{ width: "90vw", height: "40px", alignItems: "center" }}>
                            <div class="line">
                                <h3>Active Users:</h3>
                            </div>
                            <div class="line" />
                            <div class="line">
                                <h3>Server Status: {serverStatus}</h3>
                            </div>
                        </div>
                        <ul className="messages">
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
