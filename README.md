# Real-Time Chat Application

This is a real-time chat application built using React, Socket.io, and Express. It allows users to join, send messages, and view active users in real-time with a simple and clean interface.

## Project Overview

The Real-Time Chat Application enables real-time, bidirectional communication between multiple clients and the server. Users can join the chat, see other active users, and exchange messages with each other instantly.

### Features

- **User Login**: Users can join the chat with a unique identity.
- **Real-time Messaging**: Messages are instantly broadcasted to all connected users.
- **User List**: Active users are displayed, updating as users join or leave the chat.
- **Event-based Communication**: Leveraging WebSocket events for efficient data transfer.

## Project Flow

### Client Side
- **React Frontend**: Manages the UI components and displays real-time chat messages.
- **Socket.io Client**: Establishes a WebSocket connection with the server for live data exchange.
- **Components**:
  - **Login View**: Interface for users to enter the chat.
  - **Chat View**: Main view displaying the chat and user list.
  - **Message List**: Shows the history of messages in real time.
  - **User List**: Displays active users in the chat room.

### WebSocket Layer
- **Real-time Communication**: Utilizes Socket.io to enable instant, bidirectional communication.
- **Event-based Messaging**: Handles events such as user join, message send, and user disconnect.

### Server Side
- **Express Server**: Hosts the backend logic and manages client connections.
- **Socket.io Server**: Facilitates real-time communication between clients and the server.
- **User Session Management**: Tracks users in the chat and manages user sessions.
- **Message Broadcasting**: Sends messages from one user to all other users in real time.
- **Active User Tracking**: Maintains a list of currently active users.

### Data Flow
- **Real-time Message Broadcasting**: Messages sent by users are broadcasted to all connected clients.
- **User Status Updates**: Users joining or leaving the chat are immediately reflected in the user list.
- **Session Management**: Keeps track of active users and manages their connections.

## User Interface

The application has a minimalistic and clean UI. Users can:
- View messages in real-time as they are sent.
- See notifications when a user joins or leaves the chat.
- Send messages using the input box at the bottom of the chat view.

## Technologies Used

- **Frontend**: React, Socket.io Client
- **Backend**: Node.js, Express, Socket.io Server

#demo


https://github.com/user-attachments/assets/62fd91d5-beca-423f-a745-3e1f8747cd2d

