
const AppHeader = ({ sidebar, setSidebar, editingUsername, editedUsername, setEditedUsername, handleUsernameSave, username, handleUsernameEdit }) => {
    return (
        <div
            className="App-header"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "10px",
                height: "70px" }}>
            <div class="line" style={{ alignItems: "center" }}>
                <input
                    style={{ width: "50px", height: "50px", padding: "10px", paddingRight: "15px" }}
                    type="image"
                    alt="sidebar icon"
                    src="https://cdn-icons-png.flaticon.com/128/10486/10486773.png"
                    onClick={() => setSidebar(!sidebar)}/>
                <div class="line">
                    <h2 style={{ fontSize: "xx-large" }}>Channel: Global</h2>
                </div>
            </div>
            <div style={{ position: "relative", display: "inlineBlock"}}>
                <img style={{ marginTop: "38px" }}src="/banner.png" alt="novachat banner" />
                <h4 style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "1px",
                    fontSize: "85px",
                    marginTop: "6px"
                }}>novachat</h4>
            </div>
            <div class="line" style={{justifyContent: "flex-end", alignItems: "center" }}>
                <div class="line" style={{ alignItems: "center" }}>
                    {editingUsername ? (
                        <>
                            <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
                            <button onClick={handleUsernameSave}>Save</button>
                        </>
                    ) : (
                            <h2 style={{ paddingRight: "10px", marginLeft: "-40px", fontSize: "xx-large" }}>Chatting as: {username}</h2>
                        )}
                    <input 
                        style={{ width: "20px", height: "20px" }}
                        type="image"
                        alt="edit icon"
                        src="/edit-icon.png"
                        onClick={handleUsernameEdit} />
                </div>
                <img style={{ width: "50px", height: "50px", padding: "0px", borderRadius: "10px", border: "1px solid #ccc" }} src="/nova.jpg" alt="nova icon" />
            </div>
        </div>
    );
};

export default AppHeader;
