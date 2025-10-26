import { Ride, User } from '../models/index.js';

function parseDateAndTime(dateStr, timeStr) {
    if (!dateStr || typeof dateStr !== 'string') throw new Error('Invalid date format');

    // Accept dd-mm-yyyy or dd/mm/yyyy
    let dateOnly;
    const dmy = dateStr.trim().match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/);
    const iso = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

    if (dmy) {
        const day = parseInt(dmy[1], 10);
        const month = parseInt(dmy[2], 10) - 1;
        const year = parseInt(dmy[3], 10);
        dateOnly = new Date(year, month, day);
    } else if (iso) {
        const year = parseInt(iso[1], 10);
        const month = parseInt(iso[2], 10) - 1;
        const day = parseInt(iso[3], 10);
        dateOnly = new Date(year, month, day);
    } else {
        // last resort: let Date try to parse (handles many formats)
        dateOnly = new Date(dateStr);
    }

    if (isNaN(dateOnly)) throw new Error('Invalid date format');
    // normalize to start of day (local)
    dateOnly.setHours(0, 0, 0, 0);

    if (!timeStr || typeof timeStr !== 'string') throw new Error('Invalid time format');

    // try 24h: "HH:MM" or "H:MM"
    let m = timeStr.trim().match(/^(\d{1,2}):(\d{2})$/);
    let hours, minutes;
    if (m) {
        hours = parseInt(m[1], 10);
        minutes = parseInt(m[2], 10);
    } else {
        // try 12h with AM/PM: "H:MM AM" / "HH:MMpm"
        m = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/);
        if (!m) throw new Error('Time must be in HH:MM (24h) or HH:MM AM/PM format');
        hours = parseInt(m[1], 10);
        minutes = parseInt(m[2], 10);
        const ampm = m[3].toLowerCase();
        if (ampm === 'pm' && hours < 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid hour or minute value in time');
    }

    const departure = new Date(dateOnly);
    departure.setHours(hours, minutes, 0, 0);

    return { dateOnly, departure };
}

// @desc Create a new ride
// @route POST /api/driver/rides
// @access Private (Driver only)
const createRide = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const {
            from,
            to,
            date,
            time,
            availableSeats,
            pricePerSeat,
            vehicle,
            notes
        } = req.body;

        // Validation
        if (!from || !to || !date || !time || !availableSeats || !pricePerSeat || !vehicle) {
            return res.status(400).json({
                message: 'Please provide all required fields: from, to, date, time, availableSeats, pricePerSeat, and vehicle'
            });
        }

        let dateOnly, departureDateTime;
        try {
            const parsed = parseDateAndTime(String(date), String(time));
            dateOnly = parsed.dateOnly;
            departureDateTime = parsed.departure;
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        // disallow past departures
        if (departureDateTime < new Date()) {
            return res.status(400).json({ message: 'Cannot create a ride in the past' });
        }

        // Get driver ID from session/cookie (assuming email is stored in cookie)
        const driverEmail = req.cookies.email; // You'll need to set this during login

        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Find the driver
        const driver = await User.findOne({ email: driverEmail }).exec();

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Check if user has driver role
        if (!driver.role.driver) {
            return res.status(403).json({ message: 'User is not authorized to create rides. Driver role required.' });
        }

        // Validate date is not in the past
        const rideDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (rideDate < today) {
            return res.status(400).json({ message: 'Cannot create a ride for a past date' });
        }

        // Validate available seats
        if (availableSeats < 1 || availableSeats > 8) {
            return res.status(400).json({ message: 'Available seats must be between 1 and 8' });
        }

        // Validate price
        if (pricePerSeat < 0) {
            return res.status(400).json({ message: 'Price per seat cannot be negative' });
        }

        // Create the ride
        const newRide = new Ride({
            driver: driver._id,
            from: from.trim(),
            to: to.trim(),
            date: dateOnly,
            time: time.trim(),
            departureDateTime: departureDateTime,
            availableSeats: parseInt(availableSeats),
            totalSeats: parseInt(availableSeats),
            pricePerSeat: parseFloat(pricePerSeat),
            vehicle: vehicle.trim(),
            notes: notes ? String(notes).trim() : '',
            status: 'upcoming',
            isDraft: false
        });

        // Save the ride
        const savedRide = await newRide.save();

        // Populate driver information for response
        await savedRide.populate('driver', 'name email phone avatar');

        res.status(201).json({
            message: 'Ride created successfully',
            ride: savedRide
        });

    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({
            message: 'Error creating ride',
            error: error.message
        });
    }
};

// @desc Get all rides for a specific driver
// @route GET /api/driver/rides
// @access Private (Driver only)
const getDriverRides = async (req, res) => {
    try {
        const driverEmail = req.cookies.email;

        if (!driverEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const driver = await User.findOne({ email: driverEmail }).exec();

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Get all rides for this driver
        const rides = await Ride.find({ driver: driver._id })
            .populate('driver', 'name email phone avatar')
            .populate('bookings')
            .sort({ departureDateTime: -1 });

        res.status(200).json({
            message: 'Rides retrieved successfully',
            count: rides.length,
            rides: rides
        });

    } catch (error) {
        console.error('Error fetching driver rides:', error);
        res.status(500).json({
            message: 'Error fetching rides',
            error: error.message
        });
    }
};

// @desc Get a single ride by ID
// @route GET /api/driver/rides/:id
// @access Private (Driver only)
const getRideById = async (req, res) => {
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

        const ride = await Ride.findOne({ _id: id, driver: driver._id })
            .populate('driver', 'name email phone avatar')
            .populate('bookings');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        res.status(200).json({
            message: 'Ride retrieved successfully',
            ride: ride
        });

    } catch (error) {
        console.error('Error fetching ride:', error);
        res.status(500).json({
            message: 'Error fetching ride',
            error: error.message
        });
    }
};

export { createRide, getDriverRides, getRideById };