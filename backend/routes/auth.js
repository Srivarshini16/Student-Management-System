const express = require('express');
const router = express.Router();
const { requireAuth, clerkClient } = require('../middleware/clerkAuth');

/**
 * GET /auth/me
 * Returns the current user's info from their Clerk profile.
 * All signed-in users are treated as admins — no email restriction.
 */
router.get('/me', requireAuth, async (req, res) => {
    try {
        const clerkUser = await clerkClient.users.getUser(req.auth.sub);
        const email = clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase() || '';

        res.json({
            user: {
                id: clerkUser.id,
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
                email,
                role: 'admin',   // Everyone is admin
                picture: clerkUser.imageUrl || ''
            }
        });
    } catch (err) {
        console.error('Failed to fetch Clerk user:', err.message);
        res.status(500).json({ message: 'Could not retrieve user info.' });
    }
});

module.exports = router;
