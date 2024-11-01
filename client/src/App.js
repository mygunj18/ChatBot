import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #00b4db, #0083b0);
  padding: 20px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  padding: 30px;
`;

const Title = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: 2.5em;
  margin-bottom: 30px;
  font-family: 'Poppins', sans-serif;
`;

const ChatBox = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 12px;
  height: 500px;
  padding: 20px;
  overflow-y: auto;
  margin-bottom: 20px;
  background: #fff;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
`;

const MessageInput = styled.input`
  width: 80%;
  padding: 15px;
  margin-right: 10px;
  border: 2px solid #e1e1e1;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0083b0;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #00b4db, #0083b0);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 131, 176, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 12px 15px;
  background-color: ${props => props.isCurrentUser ? '#dcf8c6' : '#E8E8E8'};
  border-radius: ${props => props.isCurrentUser ? '15px 15px 0 15px' : '15px 15px 15px 0'};
  align-self: ${props => props.isCurrentUser ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const UserList = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  span {
    display: inline-block;
    padding: 5px 10px;
    margin: 3px;
    background: #e3f2fd;
    border-radius: 15px;
    font-size: 14px;
  }
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const TimeStamp = styled.small`
  display: block;
  color: #666;
  font-size: 12px;
  margin-top: 5px;
  text-align: right;
`;

const MessageContent = styled.div`
  word-break: break-word;
`;

const Username = styled.strong`
  color: #2c3e50;
  margin-bottom: 5px;
  display: block;
`;

// Add this in the head section of your public/index.html
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">

const SOCKET_SERVER = 'https://chatbot-server-coy9.onrender.com';

function App() {
  // ... existing state declarations ...

  if (!isJoined) {
    return (
      <AppContainer>
        <LoginContainer>
          <Title>Welcome to ChatRoom</Title>
          <form onSubmit={joinChat}>
            <MessageInput
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <Button type="submit" style={{ marginTop: '20px' }}>Join Chat</Button>
          </form>
        </LoginContainer>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <Container>
        <Title>ChatRoom</Title>
        <UserList>
          <h3>Online Users</h3>
          {users.map((user, index) => (
            <span key={index}>{user}</span>
          ))}
        </UserList>
        <ChatBox ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <Message
              key={index}
              isCurrentUser={msg.user === username}
            >
              <MessageContent>
                <Username>{msg.user}</Username>
                {msg.message}
                <TimeStamp>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </TimeStamp>
              </MessageContent>
            </Message>
          ))}
        </ChatBox>
        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
          <MessageInput
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </Container>
    </AppContainer>
  );
}

export default App;