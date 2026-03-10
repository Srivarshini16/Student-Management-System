const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_EMAILS = [
    'admin@gmail.com'
];

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @route  POST /auth/register
// @desc   Register a new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';

        const user = await User.create({ name, email, password, role });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route  POST /auth/login
// @desc   Login existing user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Update role in case admin emails list changed
        const role = ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'user';
        if (user.role !== role) {
            user.role = role;
            await user.save();
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

// @route  GET /auth/me
// @desc   Get current user from token
router.get('/me', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
            }
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token.' });
    }
});

module.exports = router;
