import { verifyToken } from '../utils/token.js';
import { db } from '../config/db.js';

// Verifies the Bearer token issued by /auth, /register or /api/demo/login, attaches
// { uid, email, demo } to the request and points req.models at the matching database.
const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
        const payload = verifyToken(token);
        req.user = { uid: payload.sub, email: payload.email, demo: Boolean(payload.demo) };
        req.models = req.user.demo ? db.demo : db.live;
        if (!req.models) {
            return res.status(503).json({ message: 'Accounts are not available on this deployment. Use "Try Demo" to explore the app.' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
};

export default authMiddleware;
