import { Request, User, Ride, Booking } from "../../models/index.js";

// @desc Get all pending requests for driver's rides
// @route GET /api/driver/requests
// @access Private (Driver only)
const getDriverRequests = async (req, res) => {
    try {
        const driverEmail = req.cookies.email;
        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const driver = await User.findOne({ email: driverEmail }).exec();
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if user has driver role
        if (!driver.role.driver) {
            return res.status(403).json({ message: 'User is not authorized to view requests. Driver role required.' });
        }

        const requests = await Request.find({
            driver: driver._id,
            status: 'pending'
        })
            .populate('ride', 'from to date time pricePerSeat vehicle availableSeats status')
            .populate('passenger', 'name email phone avatar rating')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Requests retrieved successfully',
            count: requests.length,
            requests: requests
        });

    } catch (error) {
        console.error('Error fetching driver requests:', error);
        res.status(500).json({
            message: 'Error fetching requests',
            error: error.message
        });
    }
};

// @desc Accept a ride request
// @route PUT /api/driver/requests/:id/accept
// @access Private (Driver only)
const acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;

        const driverEmail = req.cookies.email;
        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const driver = await User.findOne({ email: driverEmail }).exec();
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const request = await Request.findOne({
            _id: id,
            driver: driver._id
        }).populate('ride').populate('passenger');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending' });
        }

        // Check if ride still has available seats
        if (request.ride.availableSeats < request.seatsRequested) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }

        // Accept the request
        await request.accept(driverResponse || 'Request accepted');

        // Create a booking
        const booking = new Booking({
            ride: request.ride._id,
            passenger: request.passenger._id,
            driver: driver._id,
            seatsBooked: request.seatsRequested,
            pricePerSeat: request.ride.pricePerSeat,
            totalPrice: request.ride.pricePerSeat * request.seatsRequested,
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

        // Update the request with booking reference
        request.booking = savedBooking._id;
        await request.save();

        // Update ride available seats
        await request.ride.bookSeats(request.seatsRequested);

        // Populate response
        await request.populate('ride', 'from to date time pricePerSeat vehicle');
        await request.populate('passenger', 'name email phone avatar');
        await request.populate('booking');

        res.status(200).json({
            message: 'Request accepted successfully',
            request: request,
            booking: savedBooking
        });

    } catch (error) {
        console.error('Error accepting request:', error);
        res.status(500).json({
            message: 'Error accepting request',
            error: error.message
        });
    }
};

// @desc Decline a ride request
// @route PUT /api/driver/requests/:id/decline
// @access Private (Driver only)
const declineRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { driverResponse } = req.body;

        const driverEmail = req.cookies.email;
        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const driver = await User.findOne({ email: driverEmail }).exec();
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const request = await Request.findOne({
            _id: id,
            driver: driver._id
        }).populate('ride').populate('passenger');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request is not pending' });
        }

        // Decline the request
        await request.decline(driverResponse || 'Request declined');

        // Populate response
        await request.populate('ride', 'from to date time pricePerSeat vehicle');
        await request.populate('passenger', 'name email phone avatar');

        res.status(200).json({
            message: 'Request declined successfully',
            request: request
        });

    } catch (error) {
        console.error('Error declining request:', error);
        res.status(500).json({
            message: 'Error declining request',
            error: error.message
        });
    }
};

// @desc Mark request as viewed by driver
// @route PUT /api/driver/requests/:id/view
// @access Private (Driver only)
const markRequestAsViewed = async (req, res) => {
    try {
        const { id } = req.params;

        const driverEmail = req.cookies.email;
        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const driver = await User.findOne({ email: driverEmail }).exec();
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const request = await Request.findOne({
            _id: id,
            driver: driver._id
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        await request.markAsViewed();

        res.status(200).json({
            message: 'Request marked as viewed'
        });

    } catch (error) {
        console.error('Error marking request as viewed:', error);
        res.status(500).json({
            message: 'Error marking request as viewed',
            error: error.message
        });
    }
};

export { getDriverRequests, acceptRequest, declineRequest, markRequestAsViewed };