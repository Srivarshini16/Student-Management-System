const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: avatar } = payload;
        
        // Find or create user
        let user = await User.findOne({ googleId });
        if (!user) {
            user = await User.create({ googleId, email, name, avatar });
        }
        
        // Issue our own JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '7d' }
        );
        
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
});

module.exports = router;
