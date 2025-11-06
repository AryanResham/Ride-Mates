# Ride Mates 🚗

A modern, full-stack ride-sharing platform that connects drivers and passengers for convenient and cost-effective travel. Built with React, Node.js, Express, MongoDB, and Firebase Authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Contributing](#contributing)

## 🌟 Overview

Ride Mates is a comprehensive ride-sharing application that enables users to offer and find rides. The platform supports dual-role functionality where users can seamlessly switch between being a driver offering rides and a passenger looking for rides. The application features real-time ride tracking, booking management, and an intuitive user interface built with modern web technologies.

## ✨ Features

### For Drivers
- **Create Rides**: Offer rides with customizable routes, pricing, and available seats
- **Manage Bookings**: View and manage passenger bookings for your rides
- **Handle Requests**: Approve or reject ride requests from passengers
- **Vehicle Management**: Register and manage vehicle details
- **Driver Dashboard**: Comprehensive overview of all rides and bookings
- **Real-time Notifications**: Get notified of new booking requests

### For Passengers
- **Find Rides**: Search and browse available rides based on routes
- **Book Rides**: Reserve seats on available rides instantly
- **Request Rides**: Send ride requests to drivers for approval
- **Booking History**: Track past and upcoming rides
- **Passenger Dashboard**: Manage all bookings and requests in one place
- **Interactive Map**: View routes using Mapbox integration

### Common Features
- **Firebase Authentication**: Secure user authentication with email/password
- **Profile Management**: Complete user profiles with personal information
- **Dual Mode**: Switch between driver and passenger roles seamlessly
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Live updates for bookings and ride status

## 🛠 Tech Stack

### Frontend
- **React 19**: Modern UI library for building interactive interfaces
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Mapbox GL**: Interactive maps for route visualization
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful icon library
- **Firebase SDK**: Client-side authentication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express 5**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling
- **Firebase Admin**: Server-side Firebase authentication verification
- **bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: Cookie parsing middleware

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v6 or higher) - Local installation or MongoDB Atlas account
- **Firebase Account** - For authentication setup
- **Mapbox Account** - For map features (optional)

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/AryanResham/Ride-Mates.git
cd Ride-Mates
```

### Install Server Dependencies

```bash
cd server
npm install
```

### Install Client Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Server Configuration

1. Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3500
NODE_ENV=development

# MongoDB Configuration
DATABASE_URI=mongodb://localhost:27017/ridemates
# Or use MongoDB Atlas:
# DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/ridemates

# Firebase Admin SDK
# Place your serviceAccountKey.json in the server directory
```

2. **Firebase Admin Setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the file as `serviceAccountKey.json` in the `server` directory

### Client Configuration

1. Create a `.env` file in the `client` directory:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mapbox Configuration (Optional)
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

2. **Firebase Client Setup**:
   - In Firebase Console, go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the configuration values to your `.env` file

## 🏃 Running the Application

### Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3500`

### Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### Production Build

For client production build:

```bash
cd client
npm run build
npm run preview
```

## 📁 Project Structure

```
Ride-Mates/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── dashboard/ # Dashboard-specific components
│   │   │   └── landing/   # Landing page components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions and API client
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── firebase.js    # Firebase configuration
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Client dependencies
│
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   │   ├── dbConn.js     # MongoDB connection
│   │   ├── firebaseAdmin.js  # Firebase Admin setup
│   │   └── corsOptions.js    # CORS configuration
│   ├── controllers/      # Request handlers
│   │   ├── api/         # API controllers
│   │   ├── authController.js
│   │   ├── registerController.js
│   │   ├── logoutController.js
│   │   └── userController.js
│   ├── middleware/       # Express middleware
│   │   └── authMiddleware.js
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Ride.js
│   │   ├── Booking.js
│   │   ├── Request.js
│   │   ├── Rating.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── index.js
│   ├── routes/          # API routes
│   │   ├── api/        # API route definitions
│   │   ├── auth.js
│   │   ├── register.js
│   │   └── logout.js
│   ├── services/        # Business logic services
│   ├── index.js         # Server entry point
│   └── package.json     # Server dependencies
│
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /auth` - Login user
- `POST /logout` - Logout user

### User Management
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile

### Driver Rides
- `GET /api/driver/rides` - Get all driver's rides
- `POST /api/driver/rides` - Create a new ride
- `PUT /api/driver/rides/:id` - Update ride details
- `DELETE /api/driver/rides/:id` - Delete a ride

### Rider Rides
- `GET /api/rider/rides` - Search/browse available rides

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/driver/bookings` - Get driver's bookings
- `GET /api/rider/bookings` - Get rider's bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update booking status

### Requests
- `GET /api/driver/requests` - Get ride requests for driver
- `GET /api/rider/requests` - Get rider's ride requests
- `POST /api/rider/requests` - Create a ride request
- `PUT /api/driver/requests/:id` - Accept/reject ride request

## 🗄 Database Models

### User
- User authentication and profile information
- Driver profile with vehicle details
- Availability status

### Ride
- Ride information created by drivers
- Route details (from/to locations with coordinates)
- Pricing and available seats
- Departure time and status

### Booking
- Confirmed bookings by passengers
- Seat reservation details
- Payment information
- Booking status tracking

### Request
- Ride requests awaiting driver approval
- Passenger message to driver
- Request status (pending/accepted/rejected)

### Rating
- User ratings and reviews
- Rating scores and feedback

### Notification
- User notifications for bookings and requests
- Read/unread status

### Message
- In-app messaging between users

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is part of a learning initiative. Please respect the code and use it responsibly.

## 👥 Authors

- AryanResham - [GitHub Profile](https://github.com/AryanResham)

## 🙏 Acknowledgments

- Firebase for authentication services
- MongoDB for database solutions
- Mapbox for mapping services
- The React and Node.js communities

---

**Happy Riding! 🚗💨**
