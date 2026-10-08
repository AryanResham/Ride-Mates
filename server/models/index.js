import userSchema from './User.js';
import rideSchema from './Ride.js';
import bookingSchema from './Booking.js';
import requestSchema from './Request.js';
import ratingSchema from './Rating.js';
import notificationSchema from './Notification.js';
import messageSchema from './Message.js';

// The app runs two databases side by side:
//   - "demo": in-memory MongoDB, seeded on boot, wiped on restart, used by the Try Demo profiles
//   - "live": MongoDB Atlas (or a second in-memory db when DATABASE_URI is unset), used by real accounts
// Each gets its own set of models bound to its own connection. Controllers read them from req.models.
export function createModels(connection) {
    return {
        User: connection.model('User', userSchema),
        Ride: connection.model('Ride', rideSchema),
        Booking: connection.model('Booking', bookingSchema),
        Request: connection.model('Request', requestSchema),
        Rating: connection.model('Rating', ratingSchema),
        Notification: connection.model('Notification', notificationSchema),
        Message: connection.model('Message', messageSchema),
    };
}
