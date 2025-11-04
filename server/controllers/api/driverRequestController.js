import { Request, User, Ride, Booking } from "../../models/index.js";

// @desc Get all pending requests for driver's rides
// @route GET /api/driver/requests
// @access Private (Driver only)
const getDriverRequests = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not a driver.' });
        }

        const requests = await Request.find({ driver: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle availableSeats status')
            .populate('passenger', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        console.error('Error fetching driver requests:', error);
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

const acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to accept requests.' });
        }

        const request = await Request.findOne({ _id: id, driver: user._id }).populate('ride').populate('passenger');
        if (!request) {
            return res.status(404).json({ message: 'Request not found or user is not the driver.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending.' });
        }

        if (request.ride.availableSeats < request.seatsRequested) {
            return res.status(400).json({ message: 'Not enough seats available.' });
        }

        await request.accept(driverResponse || 'Request accepted');

        // Generate a unique booking ID
        const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const booking = new Booking({
            ride: request.ride._id,
            passenger: request.passenger._id,
            driver: user._id,
            seatsBooked: request.seatsRequested,
            pricePerSeat: request.ride.pricePerSeat,
            totalPrice: request.ride.pricePerSeat * request.seatsRequested,
            bookingId: bookingId,
            status: 'confirmed',
            rideDetails: {
                from: request.ride.from,
                to: request.ride.to,
                date: request.ride.date,
                time: request.ride.time,
                vehicle: request.ride.vehicle,
            }
        });

        const savedBooking = await booking.save();
        request.booking = savedBooking._id;
        await request.save();

        await request.ride.bookSeats(request.seatsRequested);

        await request.populate('ride', 'from to date time pricePerSeat vehicle');
        await request.populate('passenger', 'name email phone avatar');
        await request.populate('booking');

        res.status(200).json(request);

    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({ message: 'Error accepting request', error: error.message });
    }
};

const declineRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to decline requests.' });
        }

        const request = await Request.findOne({ _id: id, driver: user._id }).populate('ride').populate('passenger');
        if (!request) {
            return res.status(404).json({ message: 'Request not found or user is not the driver.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending.' });
        }

        await request.decline(driverResponse || 'Request declined');

        await request.populate('ride', 'from to date time pricePerSeat vehicle');
        await request.populate('passenger', 'name email phone avatar');

        res.status(200).json(request);

    } catch (error) {
        console.error('Error declining request:', error);
        res.status(500).json({ message: 'Error declining request', error: error.message });
    }
};

const markRequestAsViewed = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;

        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to view requests.' });
        }

        const request = await Request.findOne({ _id: id, driver: user._id });
        if (!request) {
            return res.status(404).json({ message: 'Request not found or user is not the driver.' });
        }

        await request.markAsViewed();

        res.status(200).json({ message: 'Request marked as viewed' });

    } catch (error) {
        console.error('Error marking request as viewed:', error);
        res.status(500).json({ message: 'Error marking request as viewed', error: error.message });
    }
};

export { getDriverRequests, acceptRequest, declineRequest, markRequestAsViewed };