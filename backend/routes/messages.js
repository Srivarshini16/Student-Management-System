const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../models/Message');

// ── Multer setup for file uploads ────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext || mime) return cb(null, true);
        cb(new Error('File type not allowed'));
    }
});

// ── POST /messages/upload ─────────────────────────────────────────────────────
// Upload a file and return its URL + original name
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl, fileName: req.file.originalname });
});

// ── POST /messages ────────────────────────────────────────────────────────────
// Persist a message (private or announcement) to MongoDB
router.post('/', async (req, res) => {
    try {
        const { fromEmail, fromName, fromPicture, toEmail, message, fileUrl, fileName, type } = req.body;

        if (!fromEmail || !fromName) {
            return res.status(400).json({ error: 'fromEmail and fromName are required' });
        }

        const newMessage = new Message({
            fromEmail,
            fromName,
            fromPicture: fromPicture || '',
            toEmail: toEmail || 'all',
            message: message || '',
            fileUrl: fileUrl || null,
            fileName: fileName || null,
            type: type || 'private'
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error('Save message error:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// ── GET /messages/conversation?user1=&user2= ──────────────────────────────────
// Fetch full private conversation between two users
router.get('/conversation', async (req, res) => {
    try {
        const { user1, user2 } = req.query;
        if (!user1 || !user2) {
            return res.status(400).json({ error: 'user1 and user2 query params required' });
        }

        const messages = await Message.find({
            type: 'private',
            $or: [
                { fromEmail: user1, toEmail: user2 },
                { fromEmail: user2, toEmail: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (err) {
        console.error('Get conversation error:', err);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// ── GET /messages/announcements ───────────────────────────────────────────────
// Fetch all announcements (admin broadcasts)
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Message.find({ type: 'announcement' }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (err) {
        console.error('Get announcements error:', err);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// ── GET /messages/contacts/:email ─────────────────────────────────────────────
// Get all unique people a user has had conversations with, with last message
router.get('/contacts/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Get all private messages involving this user
        const messages = await Message.find({
            type: 'private',
            $or: [{ fromEmail: email }, { toEmail: email }]
        }).sort({ createdAt: -1 });

        // Build a contacts map keyed by the other person's email
        const contactsMap = new Map();
        messages.forEach((msg) => {
            const otherEmail = msg.fromEmail === email ? msg.toEmail : msg.fromEmail;
            const otherName = msg.fromEmail === email ? msg.toEmail : msg.fromName;

            if (!contactsMap.has(otherEmail)) {
                contactsMap.set(otherEmail, {
                    email: otherEmail,
                    name: otherName,
                    picture: msg.fromEmail !== email ? msg.fromPicture : '',
                    lastMessage: msg.message || (msg.fileName ? `📎 ${msg.fileName}` : ''),
                    lastTime: msg.createdAt,
                    unread: 0
                });
            }

            // Count unread messages from the other person
            if (msg.fromEmail !== email && !msg.read) {
                const contact = contactsMap.get(otherEmail);
                contact.unread += 1;
                contactsMap.set(otherEmail, contact);
            }
        });

        res.json(Array.from(contactsMap.values()));
    } catch (err) {
        console.error('Get contacts error:', err);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

// ── PATCH /messages/read ──────────────────────────────────────────────────────
// Mark all messages from a sender to a receiver as read
router.patch('/read', async (req, res) => {
    try {
        const { fromEmail, toEmail } = req.body;
        await Message.updateMany(
            { fromEmail, toEmail, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Mark read error:', err);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
});

module.exports = router;
