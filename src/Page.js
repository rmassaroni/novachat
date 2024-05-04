
const PageComponent = ({ refreshComponent, serverStatus, userCount, messages, newMessage, setNewMessage }) => {
    return (
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
                        {refreshComponent}
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
    )
}

export default PageComponent;
