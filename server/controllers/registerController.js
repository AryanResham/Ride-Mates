import bcrypt from 'bcrypt';
import { signToken, publicUser } from '../utils/token.js';

// POST /register
// Creates an account with email + password and returns a signed token.
const handleNewUser = async (req, res) => {
    const { User, Ride, Booking, Request, Rating } = req.models;
    const { name, email, phone, password, vehicle } = req.body;

    if (!name || !email || !phone || !password) {
        return res.status(400).json({ message: 'Name, email, phone and password are required.' });
    }
    if (String(password).length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const userData = {
            name: String(name).trim(),
            email: normalizedEmail,
            phone: String(phone).trim(),
            passwordHash: await bcrypt.hash(String(password), 10),
        };

        if (vehicle && vehicle.model && vehicle.plateNumber) {
            userData.driverProfile = {
                vehicle: {
                    model: String(vehicle.model).trim(),
                    plateNumber: String(vehicle.plateNumber).trim().toUpperCase(),
                },
            };
        }

        const newUser = await new User(userData).save();

        return res.status(201).json({ token: signToken(newUser), user: publicUser(newUser) });
    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A user with this email or plate number already exists.' });
        }
        return res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

export default handleNewUser;
