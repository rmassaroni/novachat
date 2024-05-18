import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import AppHeader from "./AppHeader";
import Sidebar from "./Sidebar";
import RefreshButton from "./RefreshButton";
import Page from "./Page";
import connectToServer from "./Client";

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
    const [showSuccess, setShowSuccess] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const roomUpdate = (newRoom) => { setMyChannels((prevChannels) => [...prevChannels, newRoom]); };
    var username1 = "user";
    //var myChannels = ["Global"];
    const [myChannels, setMyChannels] = useState(["Global"]);
    var currentUsername;

    const IP = '35.236.242.246';
    const PORT = '8443';
    const URL = "https://"+IP+":"+PORT+"/";

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
    };

    const sendServerMessage = (msg) => {
        //send(msg);
        const formattedMsg = <p className="server-message">{msg}</p>;
        setMessages((prevMessages) => [...prevMessages, formattedMsg]);
    };

    const socketParameters = async () => {
        
        const params = {
            setUsername,
            setServerStatus,
            isRefreshing,
            setIsRefreshing,
            setShowSuccess,
            setMessages,
            setMyChannels,
            setUserCount,
            socketRef,
            connectionMessage,
            username1,
            usernames,
            currentUsername,
            roomUpdate,
            send,
            sendServerMessage,
            URL
        }
        return params;
    };


    useEffect(() => {
        let refreshTimer;
        let successTimer;
        if (isRefreshing) {
            if(serverStatus == connectionMessage) socketRef.current.disconnect();
            setServerStatus("refeshing...");
            //connectToServer(socketParameters);
            connectToServer(            
                setUsername,
                setServerStatus,
                isRefreshing,
                setIsRefreshing,
                setShowSuccess,
                setMessages,
                setMyChannels,
                setUserCount,
                socketRef,
                connectionMessage,
                username1,
                usernames,
                currentUsername,
                roomUpdate,
                send,
                sendServerMessage,
                URL);
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
    }, [isRefreshing, showSuccess, setIsRefreshing]);

    useEffect(() => {
        connectToServer(            
            setUsername,
            setServerStatus,
            isRefreshing,
            setIsRefreshing,
            setShowSuccess,
            setMessages,
            setMyChannels,
            setUserCount,
            socketRef,
            connectionMessage,
            username1,
            usernames,
            currentUsername,
            roomUpdate,
            send,
            sendServerMessage,
            URL);
        return () => {
            //socketRef.current.disconnect();
        };
    }, [setIsRefreshing]);

    const updatePage = () => {}

    const clearMessages = () => {}





    const containerRef = useRef(null);
    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendChatMessage();
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
    };

    const handleUsernameEdit = () => {
        setEditingUsername(true);
        setEditedUsername(username);
    };

    const handleUsernameSave = () => {
        setUsername(editedUsername);
        setEditingUsername(false);
    };

    return (
        <div style={{ backgroundColor: "#6d6dd4" }}>
            <AppHeader 
                sidebar={sidebar} 
                setSidebar={setSidebar} 
                editingUsername={editingUsername} 
                editedUsername={editedUsername} 
                setEditedUsername={setEditedUsername} 
                handleUsernameSave={handleUsernameSave} 
                username={username} 
                handleUsernameEdit={handleUsernameEdit} />
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Sidebar myChannels={myChannels} roomUpdate={roomUpdate} sidebar={sidebar} setSideBar={setSidebar} />
                <div className="container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyPress}>
                    <Page
                        refreshComponent={<RefreshButton 
                            refreshing={refreshing} 
                            setRefreshing={setRefreshing} 
                            showSuccess={showSuccess} 
                            setShowSuccess={setShowSuccess} 
                            handleRefresh={handleRefresh} 
                            isRefreshing={isRefreshing} />}
                        serverStatus={serverStatus} 
                        userCount={userCount} 
                        messages={messages} 
                        newMessage={newMessage} 
                        setNewMessage={setNewMessage} />
                </div>
            </div>
        </div>
    );
}

export default App;
