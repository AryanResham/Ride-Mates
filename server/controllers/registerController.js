import { User } from "../models/index.js";

const handleNewUser = async (req, res) => {
    const { name, email, phone, vehicle } = req.body;
    const firebaseUid = req.user.uid; // From authMiddleware

    if (!name || !email || !phone) {
        return res.status(400).json({ 'message': 'Name, email, and phone are required.' });
    }

    try {
        // Check if user profile already exists in our DB
        const existingUser = await User.findOne({ firebaseUid });

        if (existingUser) {
            return res.status(409).json({ message: "A user profile already exists for this account." });
        }

        // Create base user data
        const userData = {
            firebaseUid,
            name,
            email,
            phone,
        };

        // If vehicle info is provided, set up the driver profile
        if (vehicle && vehicle.model && vehicle.plateNumber) {
            userData.driverProfile = {
                vehicle: {
                    model: vehicle.model,
                    plateNumber: vehicle.plateNumber,
                }
            };
        }

        // Create and save new user profile
        const newUser = new User(userData);
        await newUser.save();

        return res.status(201).json(newUser);

    } catch (err) {
        console.error('Registration error:', err);
        if (err.code === 11000) {
            return res.status(409).json({ message: "A user with this email or plate number already exists." });
        }
        return res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export default handleNewUser;