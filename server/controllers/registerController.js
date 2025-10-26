import { User } from "../models/index.js";
import bcrypt from 'bcrypt';

/*
    body {
        role: 'passenger' | 'driver' | 'both',
        name: string,
        email: string,
        phone: string,
        password: string,

        if driver or both: vehicle: {
            model: string,
            plateNumber: string,
            color: string
        }
    }
*/

const handleNewUser = async (req, res) => {
    const { role, name, email, phone, password, vehicle } = req.body;

    if (!role || !name || !email || !phone || !password) {
        return res.status(400).json({ 'message': 'All fields are required.' });
    }

    // Validate role
    if (!['passenger', 'driver', 'both'].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be 'passenger', 'driver', or 'both'." });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        // Validate vehicle details for driver or both roles
        if ((role === "driver" || role === "both")) {
            if (!vehicle || !vehicle.model || !vehicle.plateNumber || !vehicle.color) {
                return res.status(400).json({ message: "Vehicle details (model, plateNumber, color) are required for drivers." });
            }
        }

        // Hash password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Create user object based on role
        const userData = {
            name,
            email,
            phone,
            passwordHash: hashedPwd,
            role: {
                passenger: role === "passenger" || role === "both",
                driver: role === "driver" || role === "both",
                admin: false
            }
        };

        // Add vehicle information if driver or both
        if (role === "driver" || role === "both") {
            userData.vehicle = {
                model: vehicle.model,
                plateNumber: vehicle.plateNumber,
                color: vehicle.color
            };
            userData.isDriver = true;
        }

        // Create and save new user
        const newUser = new User(userData);
        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export default handleNewUser;