import { Ride, User } from '../../models/index.js';

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
        const {
            from,
            to,
            fromLocation,
            toLocation,
            date,
            time,
            availableSeats,
            pricePerSeat,
            notes
        } = req.body;

        if (!from || !to || !fromLocation || !toLocation || !date || !time || !availableSeats || !pricePerSeat) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }

        const firebaseUid = req.user.uid; // From authMiddleware
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(403).json({ message: 'User is not authorized to create rides.' });
        }

        let dateOnly, departureDateTime;
        try {
            const parsed = parseDateAndTime(String(date), String(time));
            dateOnly = parsed.dateOnly;
            departureDateTime = parsed.departure;
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        if (departureDateTime < new Date()) {
            return res.status(400).json({ message: 'Cannot create a ride in the past.' });
        }

        const newRide = new Ride({
            driver: user._id,
            from: from.trim().toLowerCase(),
            to: to.trim().toLowerCase(),
            fromLocation: fromLocation,
            toLocation: toLocation,
            date: dateOnly,
            time: time.trim(),
            departureDateTime: departureDateTime,
            availableSeats: parseInt(availableSeats),
            totalSeats: parseInt(availableSeats),
            pricePerSeat: parseFloat(pricePerSeat),
            vehicle: user.vehicleInfo,
            notes: notes ? String(notes).trim() : '',
        });

        const savedRide = await newRide.save();
        await savedRide.populate('driver', 'name email phone avatar');

        res.status(201).json(savedRide);

    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ message: 'Error creating ride', error: error.message });
    }
};

const getDriverRides = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!user.isDriver) {
            return res.status(200).json([]); // Return empty array if not a driver
        }

        const rides = await Ride.find({ driver: user._id })
            .populate('driver', 'name email phone avatar')
            .populate('bookings')
            .sort({ departureDateTime: -1 });

        res.status(200).json(rides);

    } catch (error) {
        console.error('Error fetching driver rides:', error);
        res.status(500).json({ message: 'Error fetching rides', error: error.message });
    }
};

const getRideById = async (req, res) => {
    try {
        const { id } = req.params;
        const firebaseUid = req.user.uid;
        const user = await User.findOne({ firebaseUid }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const ride = await Ride.findOne({ _id: id, driver: user._id })
            .populate('driver', 'name email phone avatar')
            .populate('bookings');

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found or user is not the driver.' });
        }

        res.status(200).json(ride);

    } catch (error) {
        console.error('Error fetching ride:', error);
        res.status(500).json({ message: 'Error fetching ride', error: error.message });
    }
};

export { createRide, getDriverRides, getRideById };