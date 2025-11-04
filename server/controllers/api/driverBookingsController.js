import { Booking, Ride, User } from '../../models/index.js';

// @desc Get all bookings for driver's rides
// @route GET /api/driver/bookings
// @access Private (Driver only)
const getDriverBookings = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not a driver' });
        }

        const bookings = await Booking.find({ driver: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status')
            .populate('passenger', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        console.error('Error fetching driver bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// @desc Accept a booking
// @route PUT /api/driver/bookings/:id/accept
// @access Private (Driver only)
const acceptBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to accept bookings' });
        }

        const booking = await Booking.findOne({ _id: id, driver: user._id })
            .populate('ride')
            .populate('passenger', 'name email phone avatar');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or user is not the driver' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking is not pending' });
        }

        // Update booking status to confirmed
        booking.status = 'confirmed';
        booking.driverResponse = driverResponse || 'Booking accepted';
        booking.acceptedAt = new Date();
        await booking.save();

        await booking.populate('ride', 'from to date time pricePerSeat vehicle');
        await booking.populate('passenger', 'name email phone avatar');

        res.status(200).json(booking);

    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ message: 'Error accepting booking', error: error.message });
    }
};

// @desc Reject a booking
// @route PUT /api/driver/bookings/:id/reject
// @access Private (Driver only)
const rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to reject bookings' });
        }

        const booking = await Booking.findOne({ _id: id, driver: user._id })
            .populate('ride')
            .populate('passenger', 'name email phone avatar');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found or user is not the driver' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking is not pending' });
        }

        // Update booking status to rejected
        booking.status = 'rejected';
        booking.driverResponse = driverResponse || 'Booking rejected';
        booking.rejectedAt = new Date();
        await booking.save();

        // Release seats back to ride
        const ride = await Ride.findById(booking.ride._id);
        if (ride) {
            await ride.releaseSeats(booking.seatsBooked);
        }

        await booking.populate('ride', 'from to date time pricePerSeat vehicle');
        await booking.populate('passenger', 'name email phone avatar');

        res.status(200).json(booking);

    } catch (error) {
        console.error('Error rejecting booking:', error);
        res.status(500).json({ message: 'Error rejecting booking', error: error.message });
    }
};

// @desc Get booking by ID (for driver)
// @route GET /api/driver/bookings/:id
// @access Private (Driver only)
const getDriverBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not a driver' });
        }

        const booking = await Booking.findOne({ _id: id, driver: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status')
            .populate('passenger', 'name email phone avatar rating');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

export { getDriverBookings, acceptBooking, rejectBooking, getDriverBookingById };