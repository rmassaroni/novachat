import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const SidebarComponent = ({ myChannels, roomUpdate, sidebar, setSidebar }) => {
    return (
        <Sidebar collapsed={sidebar} collapsedWidth="0px">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <h3>Channels</h3>
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
                {myChannels.map((channel) => (
                    <MenuItem key={channel} onClick={() => roomUpdate(channel)}>
                        {channel}
                    </MenuItem>
                ))}
            </Menu>
        </Sidebar>
    );
};

export default SidebarComponent;
