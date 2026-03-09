const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const studentRoutes = require('./routes/students');
app.use('/students', studentRoutes);

const messageRoutes = require('./routes/messages');
app.use('/messages', messageRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Student Management API is running...');
});

// Track online users
const onlineUsers = new Map();

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins with their email
    socket.on('user_join', (userData) => {
        onlineUsers.set(userData.email, {
            socketId: socket.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            role: userData.role
        });

        // Broadcast updated online users list
        io.emit('online_users', Array.from(onlineUsers.values()));
        console.log(`${userData.name} joined. Online: ${onlineUsers.size}`);
    });

    // Handle private message
    socket.on('private_message', (data) => {
        const { toEmail, fromEmail, fromName, fromPicture, message, fileUrl, fileName } = data;

        const messageData = {
            fromEmail,
            fromName,
            fromPicture,
            toEmail,
            message,
            fileUrl: fileUrl || null,
            fileName: fileName || null,
            timestamp: new Date().toISOString()
        };

        // Send to receiver
        const receiver = onlineUsers.get(toEmail);
        if (receiver) {
            io.to(receiver.socketId).emit('receive_message', messageData);
        }

        // Send back to sender
        socket.emit('receive_message', messageData);
    });

    // Handle group announcement (admin only)
    socket.on('announcement', (data) => {
        const announcementData = {
            fromEmail: data.fromEmail,
            fromName: data.fromName,
            fromPicture: data.fromPicture,
            message: data.message,
            timestamp: new Date().toISOString(),
            type: 'announcement'
        };

        // Broadcast to everyone
        io.emit('receive_announcement', announcementData);
        console.log(`Announcement from ${data.fromName}`);
    });

    // Handle attendance notification
    socket.on('attendance_alert', (data) => {
        const receiver = onlineUsers.get(data.toEmail);
        if (receiver) {
            io.to(receiver.socketId).emit('receive_notification', {
                type: 'attendance_alert',
                message: data.message,
                percentage: data.percentage,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        onlineUsers.forEach((value, key) => {
            if (value.socketId === socket.id) {
                onlineUsers.delete(key);
                console.log(`${value.name} disconnected`);
            }
        });
        io.emit('online_users', Array.from(onlineUsers.values()));
    });
});

// Export io for use in routes
module.exports = { io };

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully');
        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
            console.log('Socket.IO is ready');
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });