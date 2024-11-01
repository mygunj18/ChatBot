const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", // React app URL
        methods: ["GET", "POST"]
    }
});

// Enable CORS
app.use(cors());

// Store connected users
const users = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle user joining
    socket.on('join', (username) => {
        users.set(socket.id, username);
        io.emit('userJoined', {
            user: username,
            users: Array.from(users.values())
        });
        console.log(`${username} joined the chat`);
    });

    // Handle messages
    socket.on('message', (data) => {
        const { message } = data;
        const user = users.get(socket.id);
        io.emit('message', {
            user,
            message,
            timestamp: new Date().toISOString()
        });
        console.log(`Message from ${user}: ${message}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const username = users.get(socket.id);
        users.delete(socket.id);
        io.emit('userLeft', {
            user: username,
            users: Array.from(users.values())
        });
        console.log(`${username} left the chat`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});