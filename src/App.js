import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
    const [chatData,setChatData] = useState(null);

    // eslint-disable-next-line no-undef
    chrome.tabs.query({active: true,currentWindow: true},tabs => {
        setInterval(() => {
            // eslint-disable-next-line no-undef
            chrome.tabs.sendMessage(tabs[0].id,{},receivedData => {
                setChatData(receivedData);
            });
        },250);
    });

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    { JSON.stringify(chatData) }
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
