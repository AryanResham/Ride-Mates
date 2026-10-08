import { db } from '../config/db.js';
import { seedDemoData, demoProfileKeys } from '../demo/seed.js';
import { signToken, publicUser } from '../utils/token.js';

// GET /api/demo/profiles
// Public. Lists the selectable demo accounts with a small summary for the picker page.
const getDemoProfiles = async (req, res) => {
    const { User, Ride, Booking, Request } = db.demo;
    try {
        const users = await User.find({ isDemo: true }).sort({ createdAt: 1 }).exec();
        const now = new Date();

        const profiles = await Promise.all(
            users.map(async (u) => {
                const base = {
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    avatar: u.avatar,
                    city: u.city,
                    bio: u.bio,
                    rating: u.rating,
                    stats: u.stats,
                    isDriver: Boolean(u.isDriver),
                    vehicle: u.isDriver ? u.driverProfile.vehicle : null,
                };

                if (u.isDriver) {
                    const [completed, upcoming, pendingRequests, upcomingRides] = await Promise.all([
                        Ride.countDocuments({ driver: u._id, status: 'completed' }),
                        Ride.countDocuments({ driver: u._id, status: 'upcoming', departureDateTime: { $gte: now } }),
                        Request.countDocuments({ driver: u._id, status: 'pending' }),
                        Ride.find({ driver: u._id, status: 'upcoming' }).sort({ departureDateTime: 1 }).limit(3).select('from to departureDateTime').lean(),
                    ]);
                    return {
                        ...base,
                        summary: { completedRides: completed, upcomingRides: upcoming, pendingRequests },
                        routes: upcomingRides.map((r) => ({ from: r.from, to: r.to, departureDateTime: r.departureDateTime })),
                    };
                }

                const [completedTrips, upcomingBookings, pendingRequests] = await Promise.all([
                    Booking.countDocuments({ passenger: u._id, status: 'completed' }),
                    Booking.countDocuments({ passenger: u._id, status: 'confirmed' }),
                    Request.countDocuments({ passenger: u._id, status: 'pending' }),
                ]);
                return { ...base, summary: { completedTrips, upcomingBookings, pendingRequests, totalSpent: u.stats?.totalSpent || 0 } };
            })
        );

        // Keep the original seed ordering: drivers first, riders second
        const order = [...demoProfileKeys.drivers, ...demoProfileKeys.riders];
        profiles.sort((a, b) => order.indexOf(a.email) - order.indexOf(b.email));

        res.json({
            drivers: profiles.filter((p) => p.isDriver),
            riders: profiles.filter((p) => !p.isDriver),
        });
    } catch (err) {
        console.error('Error listing demo profiles:', err);
        res.status(500).json({ message: 'Could not load demo profiles.' });
    }
};

// POST /api/demo/login  { id }
// Public. Issues a normal auth token for a demo account so the regular dashboards work unchanged.
const demoLogin = async (req, res) => {
    const { User } = db.demo;
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Profile id is required.' });

    try {
        const user = await User.findOne({ _id: id, isDemo: true }).exec();
        if (!user) return res.status(404).json({ message: 'Demo profile not found.' });
        res.json({ token: signToken(user, { demo: true }), user: publicUser(user) });
    } catch (err) {
        console.error('Demo login error:', err);
        res.status(500).json({ message: 'Could not start demo session.' });
    }
};

// POST /api/demo/reset
// Requires a demo account token. Wipes everything and reseeds the demo data.
const resetDemo = async (req, res) => {
    const { User } = db.demo;
    try {
        const me = req.user.demo ? await User.findById(req.user.uid).exec() : null;
        if (!me || !me.isDemo) {
            return res.status(403).json({ message: 'Only demo accounts can reset the demo data.' });
        }
        const summary = await seedDemoData(db.demo, { wipe: true });
        // Seeding regenerates ids, so hand back a fresh session for the same profile
        const same = await User.findOne({ email: me.email, isDemo: true }).exec();
        res.json({
            message: 'Demo data has been reset.',
            ...summary,
            token: same ? signToken(same, { demo: true }) : null,
            user: same ? publicUser(same) : null,
        });
    } catch (err) {
        console.error('Demo reset error:', err);
        res.status(500).json({ message: 'Could not reset demo data.' });
    }
};

export { getDemoProfiles, demoLogin, resetDemo };
