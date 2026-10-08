# Ride Mates 🚗

A full-stack ride sharing app. Drivers offer rides between cities, passengers request seats, drivers accept or decline, and both sides keep a history with ratings.

**Stack:** React 19 + Vite + Tailwind on the front end. Node + Express 5 + MongoDB (Mongoose) on the back end. Email/password auth with signed tokens (no third-party auth).

## Live demo

Click **Try Demo** on the landing page. No account needed.

- Pick one of **5 drivers** or **3 riders**. Each has a rating, past trips, upcoming rides and pending requests.
- As a rider, search a route (for example Pune → Lonavala) and send a request.
- Switch to that driver from the bar at the top and accept it. Switch back and see it confirmed.
- **Reset data** in the demo bar puts everything back to the seeded state.

Demo data lives in an in-memory MongoDB that is seeded on every server start and wiped on restart, so it never touches real users. All demo accounts share the password `demo1234`.

## Two modes, one deployment

| | Demo (Try Demo) | Real accounts (Sign up / Login) |
|---|---|---|
| Database | In-memory MongoDB, seeded on boot | MongoDB Atlas via `DATABASE_URI` |
| Persists? | Until the server restarts | Yes |
| Needs setup? | No | Atlas connection string |

If `DATABASE_URI` is not set, sign-up and login return a clear "not available" message and the demo keeps working. Express serves the built React app and the API from the same URL, so it deploys as a single service.

## Run locally

```bash
npm run install:all
npm run dev
```

Client on http://localhost:5173 (proxies API calls to the server on 3500). The first start downloads the MongoDB binary once (about 100 MB).

To also test real accounts locally, copy `server/.env.example` to `server/.env` and set `DATABASE_URI`.

## Deploy to Render (free)

1. Push this repo to GitHub.
2. In Render, **New → Blueprint**, pick the repo. It reads `render.yaml` and creates one web service.
3. Set `DATABASE_URI` in the service's Environment tab (see Atlas below). `JWT_SECRET` is generated for you.
4. Deploy. First load after 15 minutes idle takes about 30 seconds on the free plan.

Skip step 3 if you only want the demo. Sign-up and login will show "not available" and everything else works.

### MongoDB Atlas (for real accounts)

1. Create a free account at mongodb.com/atlas and an **M0 free cluster**.
2. Database Access → add a user with a password.
3. Network Access → allow `0.0.0.0/0` (Render's IPs change).
4. Connect → Drivers → copy the connection string, replace `<password>`, and add `/ridemates` before the `?`.
5. Paste it as `DATABASE_URI` in Render.

## Environment variables

See `server/.env.example`. Only `DATABASE_URI` and `JWT_SECRET` matter in production. `VITE_MAPBOX_ACCESS_TOKEN` is optional: with it, location fields use Mapbox search; without it, they use a built-in list of Indian cities.

## Project structure

```
client/          React app (Vite)
  src/pages/     LandingPage, DemoPicker, DriverDashboard, PassengerDashboard
  src/components/dashboard/DemoBar.jsx   profile switcher + reset shown in demo mode
server/          Express API
  config/db.js   demo (in-memory) and live (Atlas) connections
  demo/seed.js   the 8 demo profiles and their rides, bookings, requests
  controllers/   route handlers; models come from req.models (demo or live)
  middleware/    authMiddleware (token → user + database), selectDb
render.yaml      one-service Render blueprint
```

## API overview

| Method | Route | Notes |
|---|---|---|
| POST | `/register`, `/auth` | real accounts; 503 if Atlas is not configured |
| GET | `/api/demo/profiles` | public list of demo profiles |
| POST | `/api/demo/login` | token for a demo profile |
| POST | `/api/demo/reset` | reseed demo data (demo token required) |
| GET/POST | `/api/driver/rides`, `PUT /:id/complete` | driver rides |
| GET/PUT | `/api/driver/requests`, `/:id/accept`, `/:id/decline` | incoming requests |
| GET/POST | `/api/rider/rides`, `/search` | browse and search |
| GET/POST/DELETE | `/api/rider/requests` | passenger requests |
| GET | `/api/rider/bookings` | passenger history |
| POST | `/api/bookings/:id/rate` | rate a driver |
| GET/PUT | `/api/user/me` | profile |
