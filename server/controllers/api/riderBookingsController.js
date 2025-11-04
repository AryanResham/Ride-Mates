import { Booking, Ride, User } from '../../models/index.js';

// @desc Create a new instant booking
// @route POST /api/rider/bookings
// @access Private (Passenger only)
const createBooking = async (req, res) => {
    try {
        const { rideId, seatsBooked, message } = req.body;
        const firebaseUid = req.user.uid;

        if (!rideId || !seatsBooked) {
            return res.status(400).json({ message: 'Please provide rideId and seatsBooked' });
        }

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const ride = await Ride.findById(rideId).populate('driver', 'name email phone');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'upcoming') {
            return res.status(400).json({ message: 'Cannot book rides that are not upcoming' });
        }

        if (ride.availableSeats < seatsBooked) {
            return res.status(400).json({ message: 'Not enough seats available for this booking' });
        }

        // Check if user already has a booking for this ride
        const existingBooking = await Booking.findOne({
            ride: rideId,
            passenger: user._id,
            status: { $in: ['pending', 'confirmed', 'completed'] }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You already have a booking for this ride' });
        }

        const totalPrice = ride.pricePerSeat * seatsBooked;

        const newBooking = new Booking({
            ride: rideId,
            passenger: user._id,
            driver: ride.driver._id,
            seatsBooked: parseInt(seatsBooked),
            pricePerSeat: ride.pricePerSeat,
            totalPrice: totalPrice,
            status: 'confirmed', // Instant booking is confirmed immediately
            message: message ? String(message).trim() : '',
            rideDetails: {
                from: ride.from,
                to: ride.to,
                date: ride.date,
                time: ride.time,
                vehicle: ride.vehicle,
            }
        });

        const savedBooking = await newBooking.save();

        // Update ride availability
        await ride.bookSeats(seatsBooked);

        // Add booking to ride's bookings array
        ride.bookings.push(savedBooking._id);
        await ride.save();

        await savedBooking.populate('passenger', 'name email phone avatar');
        await savedBooking.populate('driver', 'name email phone avatar');
        await savedBooking.populate('ride', 'from to date time pricePerSeat vehicle status');

        res.status(201).json(savedBooking);

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// @desc Get all bookings for the logged-in passenger
// @route GET /api/rider/bookings
// @access Private (Passenger only)
const getPassengerBookings = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ passenger: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status')
            .populate('driver', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// @desc Get a single booking by ID
// @route GET /api/rider/bookings/:id
// @access Private (Passenger only)
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const booking = await Booking.findOne({ _id: id, passenger: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status availableSeats')
            .populate('driver', 'name email phone avatar rating');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json(booking);

    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

// @desc Cancel a booking
// @route DELETE /api/rider/bookings/:id
// @access Private (Passenger only)
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const booking = await Booking.findOne({ _id: id, passenger: user._id }).populate('ride');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        if (booking.status === 'completed') {
            return res.status(400).json({ message: 'Cannot cancel completed booking' });
        }

        // Cancel the booking
        await booking.cancel('passenger', reason || 'Cancelled by passenger');

        // Release the seats back to the ride
        await booking.ride.releaseSeats(booking.seatsBooked);

        // Remove booking from ride's bookings array
        await Ride.findByIdAndUpdate(booking.ride._id, {
            $pull: { bookings: booking._id }
        });

        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
};

export { createBooking, getPassengerBookings, getBookingById, cancelBooking };