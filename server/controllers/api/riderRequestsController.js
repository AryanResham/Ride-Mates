import { Request, Ride, User } from '../../models/index.js';

// @desc Create a new ride request
// @route POST /api/rider/requests
// @access Private (Passenger only)
const createRequest = async (req, res) => {
    try {
        const { rideId, seatsRequested, message } = req.body;

        // Validation
        if (!rideId || !seatsRequested) {
            return res.status(400).json({
                message: 'Please provide rideId and seatsRequested'
            });
        }

        // Get passenger from cookie
        const passengerEmail = req.cookies.email;
        if (!passengerEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const passenger = await User.findOne({ email: passengerEmail }).exec();
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        // Check if user has passenger role
        if (!passenger.role.passenger) {
            return res.status(403).json({ message: 'User is not authorized to create requests. Passenger role required.' });
        }

        // Find the ride
        const ride = await Ride.findById(rideId).populate('driver', 'name email phone');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if ride is upcoming and has available seats
        if (ride.status !== 'upcoming') {
            return res.status(400).json({ message: 'Cannot request for rides that are not upcoming' });
        }

        if (ride.availableSeats < seatsRequested) {
            return res.status(400).json({ message: 'Not enough seats available for this request' });
        }

        // Check if passenger already has a pending/accepted request for this ride
        const existingRequest = await Request.findOne({
            ride: rideId,
            passenger: passenger._id,
            status: { $in: ['pending', 'accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending or accepted request for this ride' });
        }

        // Create the request
        const newRequest = new Request({
            ride: rideId,
            passenger: passenger._id,
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

        // Save the request
        const savedRequest = await newRequest.save();

        // Populate passenger and driver info for response
        await savedRequest.populate('passenger', 'name email phone avatar');
        await savedRequest.populate('driver', 'name email phone avatar');
        await savedRequest.populate('ride', 'from to date time pricePerSeat vehicle');

        res.status(201).json({
            message: 'Request created successfully',
            request: savedRequest
        });

    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({
            message: 'Error creating request',
            error: error.message
        });
    }
};

// @desc Get all requests made by the current passenger
// @route GET /api/rider/requests
// @access Private (Passenger only)
const getPassengerRequests = async (req, res) => {
    try {
        const passengerEmail = req.cookies.email;
        if (!passengerEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const passenger = await User.findOne({ email: passengerEmail }).exec();
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        const requests = await Request.find({ passenger: passenger._id })
            .populate('ride', 'from to date time pricePerSeat vehicle status')
            .populate('driver', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Requests retrieved successfully',
            count: requests.length,
            requests: requests
        });

    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            message: 'Error fetching requests',
            error: error.message
        });
    }
};

// @desc Get a specific request by ID
// @route GET /api/rider/requests/:id
// @access Private (Passenger only)
const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const passengerEmail = req.cookies.email;

        if (!passengerEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const passenger = await User.findOne({ email: passengerEmail }).exec();
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        const request = await Request.findOne({
            _id: id,
            passenger: passenger._id
        })
            .populate('ride', 'from to date time pricePerSeat vehicle status availableSeats')
            .populate('driver', 'name email phone avatar rating')
            .populate('booking');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({
            message: 'Request retrieved successfully',
            request: request
        });

    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({
            message: 'Error fetching request',
            error: error.message
        });
    }
};

// @desc Cancel a pending request
// @route DELETE /api/rider/requests/:id
// @access Private (Passenger only)
const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const passengerEmail = req.cookies.email;

        if (!passengerEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const passenger = await User.findOne({ email: passengerEmail }).exec();
        if (!passenger) {
            return res.status(404).json({ message: 'Passenger not found' });
        }

        const request = await Request.findOne({
            _id: id,
            passenger: passenger._id
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Can only cancel pending requests' });
        }

        // Delete the request
        await Request.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Request cancelled successfully'
        });

    } catch (error) {
        console.error('Error cancelling request:', error);
        res.status(500).json({
            message: 'Error cancelling request',
            error: error.message
        });
    }
};

export { createRequest, getPassengerRequests, getRequestById, cancelRequest };