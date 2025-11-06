import { User } from '../models/index.js';

const getMe = async (req, res) => {
    // The firebaseUid is added to the request by the authentication middleware
    const firebaseUid = req.user.uid;

    try {
        const user = await User.findOne({ firebaseUid: firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found in our database.' });
        }

        // Return the user profile from your database
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            isDriver: user.isDriver, // Use the virtual property
            driverProfile: user.driverProfile,
            stats: user.stats,
            rating: user.rating,
        });

    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
};

const updateMe = async (req, res) => {
    const firebaseUid = req.user.uid;
    const { name, phone, car } = req.body;

    try {
        const user = await User.findOne({ firebaseUid: firebaseUid });

        if (!user) {
            return res.status(404).json({ message: 'User not found in our database.' });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;

        if (user.isDriver && car) {
            user.driverProfile.vehicle.model = car;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            isDriver: updatedUser.isDriver,
            driverProfile: updatedUser.driverProfile,
            stats: updatedUser.stats,
            rating: updatedUser.rating,
        });

    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error while updating user profile.' });
    }
};

export { getMe, updateMe };
