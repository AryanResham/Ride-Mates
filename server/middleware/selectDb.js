import { db } from '../config/db.js';

// Default every request to the live database. authMiddleware overrides this for demo tokens,
// and the /api/demo router forces the demo database for its public endpoints.
export const useLiveDb = (req, res, next) => {
    req.models = db.live;
    next();
};

export const useDemoDb = (req, res, next) => {
    req.models = db.demo;
    next();
};

// For routes that need real accounts (signup/login). Fails cleanly when Atlas isn't configured.
export const requireLiveDb = (req, res, next) => {
    if (!db.live) {
        return res.status(503).json({
            message: 'Accounts are not available on this deployment yet. Use "Try Demo" to explore the app.',
        });
    }
    next();
};
