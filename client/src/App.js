import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.close();
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setJoined(true);
      socket.emit('join', username);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('message', {
        username,
        text: message,
        time: new Date().toLocaleTimeString()
      });
      setMessage('');
    }
  };

  if (!joined) {
    return (
      <div className="join-container">
        <h2>Join Chat</h2>
        <form onSubmit={handleJoin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name..."
          />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1 className="header">Real Time Chat</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="user-avatar"></div>
            <div className="message-content">
              <div className="message-header">
                <span className="user-name">{msg.username}</span>
                <span className="time">{msg.time}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;