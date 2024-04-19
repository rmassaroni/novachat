import logo from './logo.svg';
import React, { useRef } from 'react';
import './App.css';

function App() {
    const containerRef = useRef(null);
    const handleKeyPress = (e) => {
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
                        <input type="text" className="input-class" />
                    </div>
                </header>

            </div>
            <div className="container" ref={containerRef} tabIndex="0" onKeyDown={handleKeyPress}>

                <div className="page">
                    <h1>WiFi Channel: </h1>
                    <ul class="messages">
                        test message
                        test message 2
                    </ul>
                </div>
                <div className="page">Chatroom</div>
                <div className="page">Global Channel</div>
            </div>
        </div>
    );
}

export default App;
