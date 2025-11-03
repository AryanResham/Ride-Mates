import { Request, Ride, User } from '../../models/index.js';

// @desc Create a new ride request
// @route POST /api/rider/requests
// @access Private (Passenger only)
const createRequest = async (req, res) => {
    try {
        const { rideId, seatsRequested, message } = req.body;
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
            return res.status(400).json({ message: 'Cannot request for rides that are not upcoming' });
        }

        if (ride.availableSeats < seatsRequested) {
            return res.status(400).json({ message: 'Not enough seats available for this request' });
        }

        const existingRequest = await Request.findOne({
            ride: rideId,
            passenger: user._id,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending or accepted request for this ride' });
        }

        const newRequest = new Request({
            ride: rideId,
            passenger: user._id,
            driver: ride.driver._id,
            seatsRequested: parseInt(seatsRequested),
            message: message ? String(message).trim() : '',
            rideInfo: {
                from: ride.from,
                to: ride.to,
                date: ride.date,
                time: ride.time,
                pricePerSeat: ride.pricePerSeat,
            }
        });

        const savedRequest = await newRequest.save();

        await savedRequest.populate('passenger', 'name email phone avatar');
        await savedRequest.populate('driver', 'name email phone avatar');
        await savedRequest.populate('ride', 'from to date time pricePerSeat vehicle');

        res.status(201).json(savedRequest);

    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Error creating request', error: error.message });
    }
};

const getPassengerRequests = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const requests = await Request.find({ passenger: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status')
            .populate('driver', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);

    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Error fetching requests', error: error.message });
    }
};

const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const request = await Request.findOne({ _id: id, passenger: user._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status availableSeats')
            .populate('driver', 'name email phone avatar rating')
            .populate('booking');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(request);

    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ message: 'Error fetching request', error: error.message });
    }
};

const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const request = await Request.findOne({ _id: id, passenger: user._id });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending requests' });
        }

        await Request.findByIdAndDelete(id);

        res.status(200).json({ message: 'Request cancelled successfully' });

    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({ message: 'Error cancelling request', error: error.message });
    }
};

export { createRequest, getPassengerRequests, getRequestById, cancelRequest };