// Express serves the built client itself, so most requests are same-origin and need no CORS.
// The allowlist below only matters if you host the client somewhere else (e.g. Vercel):
// add that URL to ALLOWED_ORIGINS as a comma separated list.
const extraOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

const devOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        // No Origin header = same-origin or a non-browser client (curl, health checks)
        if (!origin) return callback(null, true);
        const allowed = [...devOrigins, ...extraOrigins];
        if (allowed.includes(origin) || /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
};

export default corsOptions;
