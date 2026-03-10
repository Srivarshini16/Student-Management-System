const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});

/**
 * Express middleware that verifies a Clerk JWT from the Authorization header.
 * On success, attaches `req.auth` (the decoded payload) to the request.
 * On failure, responds with 401.
 */
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // verifyToken checks signature, expiry, and issuer against your Clerk instance
        const payload = await clerkClient.verifyToken(token);
        req.auth = payload;
        next();
    } catch (err) {
        console.error('Clerk token verification failed:', err.message);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = { requireAuth, clerkClient };
