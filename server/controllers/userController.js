import { publicUser } from '../utils/token.js';

const getMe = async (req, res) => {
    const { User, Ride, Booking, Request, Rating } = req.models;
    try {
        const user = await User.findById(req.user.uid).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found in our database.' });
        }
        res.status(200).json(publicUser(user));
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
};

const updateMe = async (req, res) => {
    const { User, Ride, Booking, Request, Rating } = req.models;
    const { name, phone, car, bio, city } = req.body;

    try {
        const user = await User.findById(req.user.uid).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found in our database.' });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;
        if (typeof bio === 'string') user.bio = bio;
        if (typeof city === 'string') user.city = city;

        if (user.isDriver && car) {
            user.driverProfile.vehicle.model = car;
        }

        const updatedUser = await user.save();
        res.status(200).json(publicUser(updatedUser));
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error while updating user profile.' });
    }
};

export { getMe, updateMe };
