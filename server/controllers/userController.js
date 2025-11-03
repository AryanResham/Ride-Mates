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
            avatar: user.avatar,
            isDriver: user.isDriver, // Use the virtual property
            driverProfile: user.driverProfile
        });

    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error while fetching user profile.' });
    }
};

export { getMe };
