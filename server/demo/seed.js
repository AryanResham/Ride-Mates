import bcrypt from 'bcrypt';
import { cityByName } from './cities.js';

export const DEMO_PASSWORD = 'demo1234';

const avatar = (seed) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffdfbf,c0aede,b6e3f4,d1d4f9`;

// ---------- date helpers (all relative to "now" so the demo never goes stale) ----------
const dayAt = (dayOffset, time) => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(0, 0, 0, 0);
    const [h, m] = time.split(':').map(Number);
    const departure = new Date(d);
    departure.setHours(h, m, 0, 0);
    return { date: d, departure };
};

const daysAgo = (n, hours = 12) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(hours, 0, 0, 0);
    return d;
};

const newBookingId = () => `BK${Date.now()}${Math.random().toString(36).slice(2, 11).toUpperCase()}`;

// ---------- people ----------
const DRIVERS = [
    {
        key: 'priya', name: 'Priya Sharma', email: 'priya@demo.ridemates.app', phone: '+91 98220 11223',
        city: 'Pune', vehicle: { model: 'Honda City', plateNumber: 'MH-12-AB-1234' },
        rating: { average: 4.8, count: 37 },
        bio: 'Weekend commuter between Pune and Mumbai. Coffee stops are mandatory.',
    },
    {
        key: 'arjun', name: 'Arjun Mehta', email: 'arjun@demo.ridemates.app', phone: '+91 99001 44556',
        city: 'Bangalore', vehicle: { model: 'Maruti Swift', plateNumber: 'KA-01-MJ-4521' },
        rating: { average: 4.5, count: 22 },
        bio: 'Software engineer, drives to Mysore most Fridays. Music on, phones off.',
    },
    {
        key: 'rohan', name: 'Rohan Kapoor', email: 'rohan@demo.ridemates.app', phone: '+91 98110 77889',
        city: 'Delhi', vehicle: { model: 'Toyota Innova Crysta', plateNumber: 'DL-3C-AZ-9087' },
        rating: { average: 4.2, count: 58 },
        bio: 'Roomy 7-seater. Regular Delhi to Jaipur and Agra runs, luggage welcome.',
    },
    {
        key: 'sneha', name: 'Sneha Iyer', email: 'sneha@demo.ridemates.app', phone: '+91 98400 22334',
        city: 'Chennai', vehicle: { model: 'Hyundai Creta', plateNumber: 'TN-09-BX-3310' },
        rating: { average: 4.9, count: 14 },
        bio: 'New to Ride Mates but not to the ECR. Chennai to Pondicherry on most weekends.',
    },
    {
        key: 'vikram', name: 'Vikram Reddy', email: 'vikram@demo.ridemates.app', phone: '+91 99490 55667',
        city: 'Hyderabad', vehicle: { model: 'Mahindra XUV700', plateNumber: 'TS-08-EQ-7712' },
        rating: { average: 3.9, count: 41 },
        bio: 'Hyderabad to Warangal and Vijayawada. Early starts, no waiting past 10 minutes.',
    },
];

const RIDERS = [
    {
        key: 'rahul', name: 'Rahul Verma', email: 'rahul@demo.ridemates.app', phone: '+91 98600 12345',
        city: 'Pune', rating: { average: 4.7, count: 12 },
        bio: 'Travels to Mumbai twice a month for work. Light packer, quiet passenger.',
    },
    {
        key: 'ananya', name: 'Ananya Gupta', email: 'ananya@demo.ridemates.app', phone: '+91 97400 67890',
        city: 'Bangalore', rating: { average: 4.9, count: 8 },
        bio: 'Student at IISc. Heads home to Mysore whenever there is a long weekend.',
    },
    {
        key: 'karan', name: 'Karan Malhotra', email: 'karan@demo.ridemates.app', phone: '+91 98100 24680',
        city: 'Delhi', rating: { average: 4.3, count: 5 },
        bio: 'Photographer chasing forts and food between Delhi, Jaipur and Agra.',
    },
];

// Extra passengers that make driver bookings look busier. Not selectable in the demo.
const EXTRAS = [
    { key: 'meera', name: 'Meera Nair', email: 'meera@demo.ridemates.app', phone: '+91 98450 99887', city: 'Chennai', rating: { average: 4.6, count: 9 } },
    { key: 'dev', name: 'Dev Patel', email: 'dev@demo.ridemates.app', phone: '+91 99880 33221', city: 'Hyderabad', rating: { average: 4.4, count: 6 } },
];

// ---------- seed ----------
export async function seedDemoData(models, { wipe = true } = {}) {
    const { User, Ride, Booking, Request, Rating, Notification, Message } = models;
    const started = Date.now();

    if (wipe) {
        await Promise.all([
            User.deleteMany({}),
            Ride.deleteMany({}),
            Booking.deleteMany({}),
            Request.deleteMany({}),
            Rating.deleteMany({}),
            Notification.deleteMany({}),
            Message.deleteMany({}),
        ]);
    }

    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const users = {};

    const makeUser = async (p, { selectable, driver }) => {
        const doc = new User({
            name: p.name,
            email: p.email,
            phone: p.phone,
            passwordHash,
            avatar: avatar(p.name),
            city: p.city,
            bio: p.bio || '',
            isDemo: selectable,
            rating: p.rating,
            ...(driver ? { driverProfile: { vehicle: p.vehicle } } : {}),
        });
        users[p.key] = doc;
        return doc;
    };

    for (const d of DRIVERS) await makeUser(d, { selectable: true, driver: true });
    for (const r of RIDERS) await makeUser(r, { selectable: true, driver: false });
    for (const e of EXTRAS) await makeUser(e, { selectable: false, driver: false });

    const rides = [];
    const bookings = [];
    const requests = [];

    // Creates a ride document for a driver between two cities.
    // dayOffset < 0 = a past ride; status defaults to completed for past, upcoming otherwise.
    const ride = (driverKey, fromName, toName, dayOffset, time, price, seats, opts = {}) => {
        const driver = users[driverKey];
        const from = cityByName(fromName);
        const to = cityByName(toName);
        if (!from || !to) throw new Error(`Unknown city: ${fromName} / ${toName}`);
        const { date, departure } = dayAt(dayOffset, time);
        const doc = new Ride({
            driver: driver._id,
            from: fromName.toLowerCase(),
            to: toName.toLowerCase(),
            fromLocation: { type: 'Point', coordinates: from.center },
            toLocation: { type: 'Point', coordinates: to.center },
            date,
            time,
            departureDateTime: departure,
            availableSeats: seats,
            totalSeats: seats,
            pricePerSeat: price,
            vehicle: driver.vehicleInfo,
            notes: opts.notes || '',
            distance: opts.distance || '',
            duration: opts.duration || '',
            status: opts.status || (dayOffset < 0 ? 'completed' : 'upcoming'),
            preferences: opts.preferences || {},
        });
        rides.push(doc);
        return doc;
    };

    // Confirms a passenger on a ride. Completed bookings feed rider/driver stats.
    const book = (rideDoc, passengerKey, seats, opts = {}) => {
        const passenger = users[passengerKey];
        const isCompleted = rideDoc.status === 'completed';
        const total = rideDoc.pricePerSeat * seats;
        const doc = new Booking({
            ride: rideDoc._id,
            passenger: passenger._id,
            driver: rideDoc.driver,
            seatsBooked: seats,
            pricePerSeat: rideDoc.pricePerSeat,
            totalPrice: total,
            status: isCompleted ? 'completed' : 'confirmed',
            message: opts.message || '',
            bookingId: newBookingId(),
            rideDetails: {
                from: rideDoc.from,
                to: rideDoc.to,
                date: rideDoc.date,
                time: rideDoc.time,
                vehicle: rideDoc.vehicle,
            },
            payment: isCompleted ? { status: 'completed', method: opts.method || 'upi', paidAt: rideDoc.departureDateTime } : { status: 'pending' },
            confirmedAt: new Date(rideDoc.departureDateTime.getTime() - 2 * 24 * 3600 * 1000),
            completedAt: isCompleted ? new Date(rideDoc.departureDateTime.getTime() + 4 * 3600 * 1000) : undefined,
            ratings: opts.rating
                ? { passengerRatedDriver: true, passengerRating: opts.rating, passengerReview: opts.review || '' }
                : { passengerRatedDriver: false },
        });
        rideDoc.availableSeats -= seats;
        rideDoc.totalEarnings += total;
        rideDoc.bookings.push(doc._id);
        bookings.push(doc);

        if (isCompleted) {
            const driver = users[Object.keys(users).find((k) => users[k]._id.equals(rideDoc.driver))];
            driver.stats.totalRidesAsDriver += 1;
            driver.stats.totalEarnings += total;
            passenger.stats.totalRidesAsPassenger += 1;
            passenger.stats.totalSpent += total;
        }
        return doc;
    };

    // A ride request from a passenger. Accepted requests also create the confirmed booking.
    const request = (rideDoc, passengerKey, seats, status, message, driverResponse) => {
        const passenger = users[passengerKey];
        const doc = new Request({
            ride: rideDoc._id,
            passenger: passenger._id,
            driver: rideDoc.driver,
            seatsRequested: seats,
            message,
            status,
            driverResponse: status === 'pending' ? undefined : driverResponse,
            respondedAt: status === 'pending' ? undefined : daysAgo(1, 18),
            viewedByDriver: status !== 'pending',
            rideInfo: {
                from: rideDoc.from,
                to: rideDoc.to,
                date: rideDoc.date,
                time: rideDoc.time,
                pricePerSeat: rideDoc.pricePerSeat,
            },
            expiresAt: new Date(rideDoc.departureDateTime.getTime() + 30 * 24 * 3600 * 1000),
        });
        if (status === 'accepted') {
            const b = book(rideDoc, passengerKey, seats, { message });
            doc.booking = b._id;
        }
        requests.push(doc);
        return doc;
    };

    // ======================= PRIYA (Pune) =======================
    let r;
    r = ride('priya', 'Pune, Maharashtra', 'Mumbai, Maharashtra', -21, '07:00', 450, 3, { distance: '150 km', duration: '3h 10m' });
    book(r, 'rahul', 1, { rating: 5, review: 'Smooth drive, on time, great playlist.' });
    book(r, 'meera', 2, { rating: 5 });
    r = ride('priya', 'Mumbai, Maharashtra', 'Pune, Maharashtra', -20, '18:30', 450, 3, { distance: '150 km', duration: '3h 20m' });
    book(r, 'rahul', 1, { rating: 4, review: 'Traffic near Lonavala, but Priya handled it well.' });
    r = ride('priya', 'Pune, Maharashtra', 'Lonavala, Maharashtra', -9, '08:00', 250, 3, { distance: '65 km', duration: '1h 30m' });
    book(r, 'dev', 1, { rating: 5 });
    book(r, 'rahul', 1);
    r = ride('priya', 'Pune, Maharashtra', 'Nashik, Maharashtra', -4, '06:30', 500, 3, { distance: '210 km', duration: '4h' });
    book(r, 'meera', 1, { rating: 5, review: 'Would ride again.' });

    // live: upcoming ride with an accepted passenger + a pending request
    r = ride('priya', 'Pune, Maharashtra', 'Mumbai, Maharashtra', 2, '07:00', 450, 3, {
        distance: '150 km', duration: '3h 10m', notes: 'Leaving from Hinjewadi Phase 1. One stop at the food mall on the expressway.',
    });
    request(r, 'rahul', 1, 'accepted', 'Can you pick me up near Wakad bridge?', 'Sure, Wakad bridge at 7:10 works.');
    request(r, 'ananya', 1, 'pending', 'Visiting Mumbai for an interview, will be on time!');

    r = ride('priya', 'Mumbai, Maharashtra', 'Pune, Maharashtra', 4, '19:00', 450, 3, { distance: '150 km', duration: '3h 20m', notes: 'Pickup at Dadar station west exit.' });
    request(r, 'karan', 2, 'pending', 'Two of us with camera bags, is there boot space?');
    ride('priya', 'Pune, Maharashtra', 'Lonavala, Maharashtra', 6, '08:00', 250, 3, { distance: '65 km', duration: '1h 30m' });
    ride('priya', 'Pune, Maharashtra', 'Nashik, Maharashtra', 9, '06:30', 500, 3, { distance: '210 km', duration: '4h', notes: 'Wine country run. Happy to wait 20 min at Sula on the way back.' });

    // ======================= ARJUN (Bangalore) =======================
    r = ride('arjun', 'Bangalore, Karnataka', 'Mysore, Karnataka', -14, '17:00', 350, 3, { distance: '145 km', duration: '3h' });
    book(r, 'ananya', 1, { rating: 5, review: 'Arjun is a careful driver, felt safe the whole way.' });
    book(r, 'dev', 1, { rating: 4 });
    r = ride('arjun', 'Mysore, Karnataka', 'Bangalore, Karnataka', -12, '07:30', 350, 3, { distance: '145 km', duration: '3h' });
    book(r, 'ananya', 1, { rating: 4 });
    r = ride('arjun', 'Bangalore, Karnataka', 'Coorg, Karnataka', -3, '05:30', 700, 3, { distance: '265 km', duration: '5h 30m' });
    book(r, 'meera', 2);

    r = ride('arjun', 'Bangalore, Karnataka', 'Mysore, Karnataka', 3, '17:00', 350, 3, { distance: '145 km', duration: '3h', notes: 'Friday evening run. Leaving from Koramangala.' });
    request(r, 'ananya', 1, 'pending', 'Long weekend at home! Can I get the front seat?');
    r = ride('arjun', 'Mysore, Karnataka', 'Bangalore, Karnataka', 5, '08:00', 350, 3, { distance: '145 km', duration: '3h' });
    request(r, 'dev', 1, 'accepted', 'Need to be in Bangalore by noon.', 'We will be there by 11.');
    ride('arjun', 'Bangalore, Karnataka', 'Coorg, Karnataka', 11, '05:30', 700, 3, { distance: '265 km', duration: '5h 30m', notes: 'Coffee estate weekend. Pets okay if they are small.' , preferences: { allowPets: true } });

    // ======================= ROHAN (Delhi) =======================
    r = ride('rohan', 'Delhi, Delhi', 'Jaipur, Rajasthan', -30, '06:00', 650, 6, { distance: '280 km', duration: '5h' });
    book(r, 'karan', 1, { rating: 4, review: 'Comfortable car, driver was a little late to pickup.' });
    book(r, 'meera', 2, { rating: 4 });
    book(r, 'dev', 1, { rating: 5 });
    r = ride('rohan', 'Jaipur, Rajasthan', 'Delhi, Delhi', -28, '16:00', 650, 6, { distance: '280 km', duration: '5h' });
    book(r, 'karan', 1, { rating: 4 });
    r = ride('rohan', 'Delhi, Delhi', 'Agra, Uttar Pradesh', -15, '05:30', 550, 6, { distance: '230 km', duration: '3h 30m' });
    book(r, 'karan', 1);
    book(r, 'rahul', 2, { rating: 3, review: 'Ride was fine, AC could have been stronger.' });
    r = ride('rohan', 'Delhi, Delhi', 'Chandigarh, Punjab', -6, '07:00', 600, 6, { distance: '250 km', duration: '4h 30m' });
    book(r, 'dev', 1, { rating: 4 });

    r = ride('rohan', 'Delhi, Delhi', 'Jaipur, Rajasthan', 1, '06:00', 650, 6, { distance: '280 km', duration: '5h', notes: 'Pickup from Dhaula Kuan metro. Roof carrier available for big bags.' });
    request(r, 'karan', 1, 'accepted', 'Carrying a tripod and two camera bags.', 'No problem, plenty of space.');
    book(r, 'meera', 2);
    r = ride('rohan', 'Jaipur, Rajasthan', 'Delhi, Delhi', 3, '16:00', 650, 6, { distance: '280 km', duration: '5h' });
    request(r, 'rahul', 1, 'pending', 'Flight from Delhi at 11pm, should be fine right?');
    ride('rohan', 'Delhi, Delhi', 'Agra, Uttar Pradesh', 7, '05:30', 550, 6, { distance: '230 km', duration: '3h 30m', notes: 'Taj Mahal day trip. Returning same evening on a separate listing.' });
    ride('rohan', 'Delhi, Delhi', 'Chandigarh, Punjab', 12, '07:00', 600, 6, { distance: '250 km', duration: '4h 30m' });

    // ======================= SNEHA (Chennai) =======================
    r = ride('sneha', 'Chennai, Tamil Nadu', 'Pondicherry, Tamil Nadu', -10, '06:30', 400, 3, { distance: '160 km', duration: '3h' });
    book(r, 'meera', 1, { rating: 5, review: 'Best ride I have had on the app. Sneha even shared snacks.' });
    book(r, 'ananya', 1, { rating: 5 });
    r = ride('sneha', 'Pondicherry, Tamil Nadu', 'Chennai, Tamil Nadu', -8, '17:00', 400, 3, { distance: '160 km', duration: '3h' });
    book(r, 'meera', 1, { rating: 5 });
    r = ride('sneha', 'Chennai, Tamil Nadu', 'Vellore, Tamil Nadu', -2, '08:00', 300, 3, { distance: '140 km', duration: '2h 45m' });
    book(r, 'dev', 1, { rating: 5 });

    r = ride('sneha', 'Chennai, Tamil Nadu', 'Pondicherry, Tamil Nadu', 2, '06:30', 400, 3, { distance: '160 km', duration: '3h', notes: 'ECR route with a breakfast stop at Mahabalipuram.' });
    request(r, 'ananya', 1, 'pending', 'Beach weekend! Is a small backpack okay?');
    book(r, 'meera', 1);
    ride('sneha', 'Pondicherry, Tamil Nadu', 'Chennai, Tamil Nadu', 4, '17:00', 400, 3, { distance: '160 km', duration: '3h' });
    ride('sneha', 'Chennai, Tamil Nadu', 'Vellore, Tamil Nadu', 8, '08:00', 300, 3, { distance: '140 km', duration: '2h 45m', notes: 'Hospital visit run, happy to drop at CMC main gate.' });

    // ======================= VIKRAM (Hyderabad) =======================
    r = ride('vikram', 'Hyderabad, Telangana', 'Warangal, Telangana', -25, '06:00', 350, 5, { distance: '150 km', duration: '2h 45m' });
    book(r, 'dev', 1, { rating: 4 });
    book(r, 'rahul', 1, { rating: 3, review: 'Fast driver. A bit too fast for me honestly.' });
    r = ride('vikram', 'Warangal, Telangana', 'Hyderabad, Telangana', -24, '18:00', 350, 5, { distance: '150 km', duration: '2h 45m' });
    book(r, 'dev', 1, { rating: 4 });
    r = ride('vikram', 'Hyderabad, Telangana', 'Vijayawada, Andhra Pradesh', -11, '05:00', 550, 5, { distance: '275 km', duration: '4h 30m' });
    book(r, 'karan', 1, { rating: 4 });
    book(r, 'meera', 1, { rating: 3 });
    r = ride('vikram', 'Vijayawada, Andhra Pradesh', 'Hyderabad, Telangana', -10, '16:00', 550, 5, { distance: '275 km', duration: '4h 30m' });
    book(r, 'karan', 1);
    r = ride('vikram', 'Hyderabad, Telangana', 'Warangal, Telangana', -1, '06:00', 350, 5, { distance: '150 km', duration: '2h 45m' });
    book(r, 'ananya', 1, { rating: 4 });

    r = ride('vikram', 'Hyderabad, Telangana', 'Warangal, Telangana', 2, '06:00', 350, 5, { distance: '150 km', duration: '2h 45m', notes: 'Sharp 6am departure from Uppal. Please be on time.' });
    request(r, 'dev', 1, 'accepted', 'Going home for the weekend.', 'See you at Uppal.');
    request(r, 'rahul', 1, 'declined', 'Can we leave at 7 instead of 6?', 'Sorry, 6am is fixed for this one.');
    r = ride('vikram', 'Hyderabad, Telangana', 'Vijayawada, Andhra Pradesh', 5, '05:00', 550, 5, { distance: '275 km', duration: '4h 30m' });
    request(r, 'karan', 1, 'pending', 'Any chance of a stop at Suryapet for breakfast?');
    ride('vikram', 'Vijayawada, Andhra Pradesh', 'Hyderabad, Telangana', 6, '16:00', 550, 5, { distance: '275 km', duration: '4h 30m' });
    ride('vikram', 'Hyderabad, Telangana', 'Goa, Goa', 14, '04:00', 1400, 5, { distance: '680 km', duration: '11h', notes: 'Long haul to Goa. Splitting fuel and tolls, overnight stop optional.' });

    // ---------- persist ----------
    await User.insertMany(Object.values(users));
    await Ride.insertMany(rides);
    await Booking.insertMany(bookings);
    await Request.insertMany(requests);

    console.log(
        `Demo data seeded: ${Object.keys(users).length} users, ${rides.length} rides, ${bookings.length} bookings, ${requests.length} requests (${Date.now() - started} ms)`
    );

    return { users: Object.keys(users).length, rides: rides.length, bookings: bookings.length, requests: requests.length };
}

export const demoProfileKeys = {
    drivers: DRIVERS.map((d) => d.email),
    riders: RIDERS.map((r) => r.email),
};
