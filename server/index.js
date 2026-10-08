import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { initDatabases, db } from './config/db.js';
import { useLiveDb } from './middleware/selectDb.js';
import corsOptions from './config/corsOptions.js';
import { seedDemoData, DEMO_PASSWORD } from './demo/seed.js';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import logoutRouter from './routes/logout.js';
import driverRidesRouter from './routes/api/driverRides.js';
import riderRidesRouter from './routes/api/riderRides.js';
import riderRequestsRouter from './routes/api/riderRequests.js';
import driverRequestRouter from './routes/api/driverRequest.js';
import driverBookingsRouter from './routes/api/driverBookings.js';
import riderBookingsRouter from './routes/api/riderBookings.js';
import userRouter from './routes/api/user.js';
import bookingsRouter from './routes/api/bookings.js';
import demoRouter from './routes/api/demo.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3500;
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useLiveDb);

// ---- API routes ----
app.get('/api/health', (req, res) => res.json({ ok: true, uptime: process.uptime() }));
app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/logout', logoutRouter);
app.use('/api/driver/rides', driverRidesRouter);
app.use('/api/rider/rides', riderRidesRouter);
app.use('/api/rider/requests', riderRequestsRouter);
app.use('/api/driver/requests', driverRequestRouter);
app.use('/api/driver/bookings', driverBookingsRouter);
app.use('/api/rider/bookings', riderBookingsRouter);
app.use('/api/user', userRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/demo', demoRouter);

// ---- Static client (single deployment) ----
// After `npm run build` at the repo root, the compiled React app lives in client/dist.
// Express serves it here so the site and the API share one URL.
const clientDist = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(path.join(clientDist, 'index.html'))) {
    // Asset filenames contain a content hash, so they can be cached hard.
    // index.html must never be cached: it is what points at the current hashes,
    // and a stale copy would request assets that no longer exist after a deploy.
    const sendIndex = (res) =>
        res.sendFile(path.join(clientDist, 'index.html'), {
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
        });

    app.use(
        express.static(clientDist, {
            index: false,
            maxAge: isProduction ? '1y' : 0,
            setHeaders: (res, filePath) => {
                if (filePath.endsWith('index.html')) {
                    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                }
            },
        })
    );
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api') || path.extname(req.path)) return next();
        sendIndex(res);
    });
    const assetDir = path.join(clientDist, 'assets');
    const assets = fs.existsSync(assetDir) ? fs.readdirSync(assetDir) : [];
    console.log(`Serving client from ${clientDist} (${assets.length} assets: ${assets.join(', ') || 'NONE'})`);
} else {
    console.warn(`No built client at ${clientDist}. Run "npm run build" at the repo root so Express can serve the site.`);
    app.get('/', (req, res) =>
        res.status(503).send('Ride Mates API is running, but the site has not been built. Run "npm run build" at the repo root.')
    );
}

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// ---- Boot ----
const start = async () => {
    await initDatabases({ liveUri: process.env.DATABASE_URI });
    await seedDemoData(db.demo, { wipe: true });

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Demo profiles live in the in-memory db. Password for all of them: "${DEMO_PASSWORD}"`);
        if (!db.live) console.log('Real accounts disabled: set DATABASE_URI to enable sign-up and login.');
    });
};

start();
