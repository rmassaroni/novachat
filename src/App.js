import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import cx from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from "styled-components";
import io from "socket.io-client";
import Sidebar from "./Sidebar";
import RefreshButton from "./RefreshButton";

// const rotate = keyframes`
// from {
// transform: rotate(0deg);
// }
//
// to {
// transform: rotate(360deg);
// }
// `;
// const Container = styled.div`
// display: flex;
// justify-content: center;
// align-items: center;
// padding: 16px;
// box-sizing: border-box;
// `;
//
// const brandColorPrimary = "#5b13df";
// const RefreshButton = styled.button`
// width: 2rem;
// height: 2rem;
// padding: 0;
// margin: 0;
// display: flex;
// align-items: center;
// justify-content: center;
// position: relative;
// cursor: pointer;
// border-radius: 100%;
// border: 0;
// background: #fff;
// outline-color: ${brandColorPrimary};
// .refresh--icon.refresh--icon__is-refreshing {
// animation: ${rotate} 1s infinite;
// animation-timing-function: cubic-bezier(0.42, 0.2, 0.58, 1);
// }
// `;
//
// const SuccessIcon = styled(motion.div)`
// position: absolute;
// `;


function App() {
    const CONNECTED = false;
    const socketRef = useRef();
    const usernames = [];
    const connectionMessage = "connected to server";
    const failMessage = "FAILED";
    const cap = 10; //usernames cant be longer than 10. or just shrink <h2> when cap exceeded.
    
    const [username, setUsername] = useState("user");
    const [sidebar, setSidebar] = useState(true);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [serverStatus, setServerStatus] = useState("connecting...");
    const [userCount, setUserCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [editedUsername, setEditedUsername] = useState("");

    const roomUpdate = (newRoom) => { setMyChannels((prevChannels) => [...prevChannels, newRoom]); };
    var username1 = "user";
    //var myChannels = ["Global"];
    const [myChannels, setMyChannels] = useState(["Global"]);
    var currentUsername;

    const [showSuccess, setShowSuccess] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);


    const IP = '35.236.242.246';
    const PORT = '8443';
    const URL = "https://"+IP+":"+PORT+"/";
    const connectToServer = async () => {
        try {
            console.log("Connecting to server...");
            await fetch(URL);
            //socketRef.current = io.connect("http://localhost:3000"); //use this for testing on local host. would need to redownload all the old modules.
            socketRef.current = io.connect(URL);
            socketRef.current.on("connect", () => {
                console.log(connectionMessage);
                var id = Math.floor(Math.random() * 9000) + 1000; // random four digit number
                setUsername("user" + id); // set a random username
                username1 += id;
                usernames.push(username1);
                setServerStatus(connectionMessage);
                setIsRefreshing(false);
                setShowSuccess(true);
            });
            socketRef.current.on("socket id", (sid) => {
                setUsername(sid.substring(0,10));
                currentUsername = sid.substring(0, 10);

                sendServerMessage("Your default username: " + currentUsername);
            })
            socketRef.current.on("join room", (room) => {
                roomUpdate(room);
            });
            socketRef.current.on("user count", (count) => {
                setUserCount(count);
            })
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
            //sendServerMessage("ERROR connecting to server. Try this URL: " + URL); //make url clickable
            setIsRefreshing(false);
            setServerStatus("FAILED");
        }
    };


    useEffect(() => {
        let refreshTimer;
        let successTimer;
        if (isRefreshing) {

            if(serverStatus == connectionMessage) socketRef.current.disconnect();
            setServerStatus("refeshing...");
            connectToServer();
            //connectToServer()
            refreshTimer = setTimeout(() => {
                setIsRefreshing(false);
                setShowSuccess(true);
            }, 3000);
        }
        if (showSuccess) {
            successTimer = setTimeout(() => {
                setShowSuccess(false);
            }, 1500);
        }
        return () => {
            clearTimeout(refreshTimer);
            clearTimeout(successTimer);
        };
    }, [isRefreshing, showSuccess]);

    useEffect(() => {
        connectToServer();
        return () => {
            //socketRef.current.disconnect();
        };
    }, []);

    const updatePage = () => {

    }

    const clearMessages = () => {

    }

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

    const handleRefresh = () => {
        setIsRefreshing(true);
        // setRefreshing(true);
        // setTimeout(() => {
        //     setServerStatus("refreshing...");
        //     setRefreshing(false);
        // }, 2000);
    };

        const handleUsernameEdit = () => {
        setEditingUsername(true);
        setEditedUsername(username);
    };

    const handleUsernameSave = () => {
        setUsername(editedUsername);
        setEditingUsername(false);
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
        <div style={{ backgroundColor: "#6d6dd4" }}>
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
                <div class="line" style={{ alignItems: "center" }}>
                    <input
                        style={{ width: "50px", height: "50px", padding: "10px", paddingRight: "15px" }}
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
                <div class="line" style={{justifyContent: "flex-end", alignItems: "center" }}>
                    <div class="line" style={{ alignItems: "center" }}>
                        {editingUsername ? (
                            <>
                                <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
                                <button onClick={handleUsernameSave}>Save</button>
                            </>
                        ) : (
                                <h2 style={{ paddingRight: "10px", marginLeft: "-40px" }}>Chatting as: {username}</h2>

                            )}
                        <input 
                            style={{ width: "20px", height: "20px" }}
                            type="image"
                            alt="edit icon"
                            src="/edit-icon.png"
                            onClick={handleUsernameEdit}
                        />
                    </div>
                    <img style={{ width: "50px", height: "50px", padding: "0px", borderRadius: "10px", border: "1px solid #ccc" }} src="/nova.jpg" alt="nova icon" />
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <Sidebar myChannels={myChannels} roomUpdate={roomUpdate} sidebar={sidebar} setSideBar={setSidebar} />
                <div
                    className="container"
                    ref={containerRef}
                    tabIndex="0"
                    onKeyDown={handleKeyPress}
                >
                    <div className="page">
                        <div class="line" style={{ width: "90vw", height: "40px", alignItems: "center" }}>
                            <div class="line">
                                <h3>Users Online: <span style={{ color: "green" }}>{userCount}</span></h3>
                            </div>
                            <div class="line">
                            {/* loading animation under header */}
                            </div>
                            <div class="line" style={{ alignItems: "center" }}>
                                <h3 style={{width: "16vw"}}>Server Status: {serverStatus}
                                </h3>
                                <div style={{ textAlign: "center" }}>
                                    <RefreshButton refreshing={refreshing} setRefreshing={setRefreshing} showSuccess={showSuccess} setShowSuccess={setShowSuccess} handleRefresh={handleRefresh} isRefreshing={isRefreshing}  />
                                </div>
                                <h3>sID: </h3>
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
