const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authenticate = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        req.user = payload; // Attach user info to the request object
        next();
    } catch (error) {
        console.error('Token verification failed', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = authenticate;