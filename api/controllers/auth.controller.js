const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const cookieParser = require('cookie-parser');

/* ------------------ General Authentication ------------------ */

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/*
    Google Authentication
*/
exports.googleAuthentication = async (req, res) => {
    try {
        const idToken = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

        if (!idToken) {
            return res.status(400).json({ error: 'ID token is required' });
        }

        // Verify the ID token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        res.cookie('accessToken', idToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            secure: true,
            sameSite: 'None' // Set 'None' if using cross-origin cookies
        });

        const payload = ticket.getPayload();
        const userId = payload.sub; // Google user ID
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;

        // Find or create the user in your database
        let user = await User.findOne({ googleId: userId });

        if (!user) {
            user = new User({
                googleId: userId,
                email,
                name,
                picture
            });
            await user.save();
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Server error' });
    }
};