import { Booking, Ride, User, Request } from '../../models/index.js';

// @desc Create a new booking
// @route POST /api/bookings
// @access Private (Passenger only)
const createBooking = async (req, res) => {
    // ... (existing code)
};

// @desc Get passenger's bookings
// @route GET /api/bookings
// @access Private (Passenger only)
const getPassengerBookings = async (req, res) => {
    // ... (existing code)
};

// @desc Cancel a booking
// @route DELETE /api/bookings/:id
// @access Private (Passenger only)
const cancelBooking = async (req, res) => {
    // ... (existing code)
};

// @desc Rate a driver for a booking
// @route POST /api/bookings/:bookingId/rate
// @access Private (Passenger only)
const rateDriver = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { rating, comment } = req.body;
        const firebaseUid = req.user.uid;

        if (!rating) {
            return res.status(400).json({ message: 'Rating is required' });
        }

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.passenger.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to rate this booking' });
        }

        if (booking.ratings.passengerRatedDriver) {
            return res.status(400).json({ message: 'You have already rated this driver for this booking' });
        }

        // Update booking with rating
        booking.ratings.passengerRatedDriver = true;
        booking.ratings.passengerRating = rating;
        booking.ratings.passengerReview = comment;

        await booking.save();

        // Update driver's average rating
        const driver = await User.findById(booking.driver);
        if (driver) {
            await driver.updateRating(rating);
        }

        res.status(200).json({ message: 'Rating submitted successfully' });

    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
};


export { createBooking, getPassengerBookings, cancelBooking, rateDriver };