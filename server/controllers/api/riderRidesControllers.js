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

// @desc Get all available rides
// @route GET /api/rider/rides
// @access Private (Passenger only)
const getRides = async (req, res) => {
    try {
        const userEmail = req.cookies.email;
        if (!userEmail) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User.findOne({ email: userEmail }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rides = await Ride.find({
            status: 'upcoming',
            availableSeats: { $gt: 0 }
        })
            .populate('driver', 'name email phone avatar rating')
            .sort({ departureDateTime: 1 });

        res.status(200).json({
            message: 'Rides retrieved successfully',
            count: rides.length,
            rides: rides
        });

    } catch (error) {
        console.error('Error fetching rides:', error);
        res.status(500).json({
            message: 'Error fetching rides',
            error: error.message
        });
    }
};

// @desc Search rides based on from, to, date, time
// @route GET /api/rider/rides/search
// @access Private (Passenger only)
const searchRides = async (req, res) => {
    try {
        const { from, to, date, time } = req.body;
        console.log(req.body);
        // Validation
        if (!from || !to || !date || !time) {
            return res.status(400).json({
                message: 'Please provide from, to, date, and time parameters'
            });
        }

        let departureDateTime;
        try {
            const parsed = parseDateAndTime(String(date), String(time));
            departureDateTime = parsed.departure;
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        // Allow flexible time search: +-8 hours from requested time
        const timeWindow = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const startTime = new Date(departureDateTime.getTime() - timeWindow);
        const endTime = new Date(departureDateTime.getTime() + timeWindow);

        const rides = await Ride.find({
            from: from.trim().toLowerCase(),
            to: to.trim().toLowerCase(),
            departureDateTime: { $gte: startTime, $lte: endTime },
            status: 'upcoming',
            availableSeats: { $gt: 0 }
        })
            .populate('driver', 'name email phone avatar rating')
            .sort({ departureDateTime: 1 });

        res.status(200).json({
            message: 'Rides searched successfully',
            count: rides.length,
            rides: rides
        });

    } catch (error) {
        console.error('Error searching rides:', error);
        res.status(500).json({
            message: 'Error searching rides',
            error: error.message
        });
    }
};

export { getRides, searchRides };
