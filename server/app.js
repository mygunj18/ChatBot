import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

// Styled components for the chat interface
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ChatBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 500px;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MessageInput = styled.input`
  width: 80%;
  padding: 10px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${props => props.isCurrentUser ? '#007bff22' : '#f1f1f1'};
  border-radius: 4px;
`;

const SOCKET_SERVER = 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const chatBoxRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      // Auto scroll to bottom
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    });

    socket.on('userJoined', ({ users: updatedUsers }) => {
      setUsers(updatedUsers);
    });

    socket.on('userLeft', ({ users: updatedUsers }) => {
      setUsers(updatedUsers);
    });

    return () => {
      socket.off('message');
      socket.off('userJoined');
      socket.off('userLeft');
    };
  }, [socket]);

  const joinChat = () => {
    if (username.trim() && socket) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('message', { message });
      setMessage('');
    }
  };

  if (!isJoined) {
    return (
      <Container>
        <h1>Join Chat</h1>
        <MessageInput
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={joinChat}>Join</Button>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Chat Room</h1>
      <div>
        <h3>Online Users:</h3>
        {users.map((user, index) => (
          <span key={index}>{user}, </span>
        ))}
      </div>
      <ChatBox ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <Message
            key={index}
            isCurrentUser={msg.user === username}
          >
            <strong>{msg.user}:</strong> {msg.message}
            <small style={{ float: 'right' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </Message>
        ))}
      </ChatBox>
      <div>
        <MessageInput
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </Container>
  );
}

export default App;