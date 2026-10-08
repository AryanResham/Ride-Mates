// Express serves the built client itself, so the common case is same-origin.
// Vite tags its assets with crossorigin, which makes the browser send an Origin
// header even then, so same-origin requests must be matched by comparing the
// Origin against the request's own Host (works on any domain, no config needed).
// ALLOWED_ORIGINS is only needed if the client is hosted elsewhere (e.g. Vercel).
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

const devOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

const isSameOrigin = (origin, req) => {
    try {
        return new URL(origin).host === req.headers.host;
    } catch {
        return false;
    }
};

// Dynamic form so the handler can see the request, not just the Origin header.
const corsOptions = (req, callback) => {
    const origin = req.headers.origin;

    // No Origin header: same-origin navigation, curl, health checks
    if (!origin) return callback(null, { origin: true, credentials: true });

    const allowed =
        isSameOrigin(origin, req) ||
        devOrigins.includes(origin) ||
        extraOrigins.includes(origin) ||
        /^https?:\/\/localhost(:\d+)?$/.test(origin);

    callback(null, {
        origin: allowed,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200,
    });
};

export default corsOptions;
