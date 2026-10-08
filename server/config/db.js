import mongoose from 'mongoose';
import { createModels } from '../models/index.js';

// Two databases:
//   demo -> always in-memory MongoDB, seeded on boot, wiped on restart (Try Demo profiles)
//   live -> MongoDB Atlas via DATABASE_URI (real accounts). Null when not configured.
export const db = { demo: null, live: null };

let memoryServer = null;

export async function initDatabases({ liveUri } = {}) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
    const demoConn = await mongoose.createConnection(memoryServer.getUri('ridemates_demo')).asPromise();
    db.demo = createModels(demoConn);
    console.log('Demo database ready (in-memory)');

    if (liveUri) {
        try {
            const liveConn = await mongoose.createConnection(liveUri, { serverSelectionTimeoutMS: 10000 }).asPromise();
            db.live = createModels(liveConn);
            console.log('Live database ready (DATABASE_URI)');
        } catch (err) {
            console.error('Could not connect to DATABASE_URI. Real accounts are disabled until it works:', err.message);
        }
    } else {
        console.log('DATABASE_URI not set. Real sign-up/login is disabled; the demo still works.');
    }

    const shutdown = async () => {
        try {
            await mongoose.disconnect();
            if (memoryServer) await memoryServer.stop();
        } finally {
            process.exit(0);
        }
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    return db;
}
