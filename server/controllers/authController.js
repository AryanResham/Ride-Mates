import bcrypt from 'bcrypt';
import { signToken, publicUser } from '../utils/token.js';

// POST /auth
// Email + password login. Returns a signed token and the user profile.
const handleLogin = async (req, res) => {
    const { User, Ride, Booking, Request, Rating } = req.models;
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email: String(email).trim().toLowerCase() }).exec();
        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(String(password), user.passwordHash);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        return res.json({ token: signToken(user), user: publicUser(user) });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error.' });
    }
};

export default handleLogin;
