import { Booking, Ride, User, Request } from '../../models/index.js';

// @desc Create a new booking
// @route POST /api/bookings
// @access Private (Passenger only)
const createBooking = async (req, res) => {
    try {
        const { rideId, seatsRequested, message, pickupPoint, dropPoint } = req.body;
        const firebaseUid = req.user.uid;

        if (!rideId || !seatsRequested) {
            return res.status(400).json({ message: 'Please provide rideId and seatsRequested' });
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

        if (ride.availableSeats < seatsRequested) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Check if user already has a booking for this ride
        const existingBooking = await Booking.findOne({
            ride: rideId,
            passenger: user._id,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'You already have a booking for this ride' });
        }

        // Create booking
        const totalPrice = ride.pricePerSeat * seatsRequested;
        
        // Generate a unique booking ID
        const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        const newBooking = new Booking({
            ride: rideId,
            passenger: user._id,
            driver: ride.driver._id,
            seatsBooked: parseInt(seatsRequested),
            pricePerSeat: ride.pricePerSeat,
            totalPrice: totalPrice,
            bookingId: bookingId,
            message: message ? String(message).trim() : '',
            pickupPoint: pickupPoint ? String(pickupPoint).trim() : '',
            dropPoint: dropPoint ? String(dropPoint).trim() : '',
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
        await ride.bookSeats(seatsRequested);

        // Add booking to ride's bookings array
        ride.bookings.push(savedBooking._id);
        await ride.save();

        await savedBooking.populate('passenger', 'name email phone avatar');
        await savedBooking.populate('driver', 'name email phone avatar');
        await savedBooking.populate('ride', 'from to date time pricePerSeat vehicle');

        res.status(201).json(savedBooking);

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// @desc Get passenger's bookings
// @route GET /api/bookings
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

// @desc Cancel a booking
// @route DELETE /api/bookings/:id
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

        const booking = await Booking.findOne({ _id: id, passenger: user._id });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'pending' && booking.status !== 'confirmed') {
            return res.status(400).json({ message: 'Cannot cancel this booking' });
        }

        // Update booking status
        await booking.cancel('passenger', reason);

        // Release seats back to ride
        const ride = await Ride.findById(booking.ride);
        if (ride) {
            await ride.releaseSeats(booking.seatsBooked);
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
};

export { createBooking, getPassengerBookings, cancelBooking };