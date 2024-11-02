import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const SOCKET_SERVER = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatBoxRef, setChatBoxRef] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_SERVER);
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('userJoined', (data) => {
      setUsers(data.users);
    });

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('updateUsers', (data) => {
      setUsers(data.users);
    });

    return () => {
      socket.off('userJoined');
      socket.off('message');
      socket.off('updateUsers');
    };
  }, [socket]);

  const joinChat = (e) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join', { username });
      setIsJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('sendMessage', { message });
      setMessage('');
    }