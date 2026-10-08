import jwt from 'jsonwebtoken';

const DEV_FALLBACK_SECRET = 'ridemates-dev-secret-change-me';

const getSecret = () => {
    if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
    if (process.env.NODE_ENV === 'production') {
        console.warn('JWT_SECRET is not set. Using an insecure fallback secret. Set JWT_SECRET in your environment.');
    }
    return DEV_FALLBACK_SECRET;
};

// `demo` marks tokens for the Try Demo profiles so requests are routed to the demo database.
export const signToken = (user, { demo = false } = {}) =>
    jwt.sign(
        { sub: user._id.toString(), email: user.email, demo },
        getSecret(),
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

export const verifyToken = (token) => jwt.verify(token, getSecret());

// Shape of the user object returned to the client after login/register/me
export const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    city: user.city,
    bio: user.bio,
    isDriver: Boolean(user.isDriver),
    isDemo: Boolean(user.isDemo),
    driverProfile: user.driverProfile,
    stats: user.stats,
    rating: user.rating,
    createdAt: user.createdAt,
});
