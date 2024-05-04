    import io from "socket.io-client";


const connectToServer = async (setUsername, setServerStatus, setIsRefreshing, setShowSuccess, setMessages, setMyChannels, setUserCount, socketRef, connectionMessage, username1, usernames, currentUsername, roomUpdate, send, sendServerMessage, URL) => {
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
            //setWifiHeader(wifi);
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

export default connectToServer;
