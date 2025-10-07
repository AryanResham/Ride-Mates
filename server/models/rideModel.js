import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  passengers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  seatsAvailable: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  departure: {
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function(coords) {
          return coords.length === 2;
        },
        message: 'Coordinates must contain exactly 2 elements [longitude, latitude]'
      }
    },
  },
  arrival: {
    location: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: function(coords) {
          return coords.length === 2;
        },
        message: 'Coordinates must contain exactly 2 elements [longitude, latitude]'
      }
    },
  },
  departureTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Departure time must be in the future'
    }
  },
  estimatedArrivalTime: {
    type: Date,
    required: true,
    validate: {
      validator: function(date) {
        return date > this.departureTime;
      },
      message: 'Arrival time must be after departure time'
    }
  },
  rideStatus: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  farePerSeat: {
    type: Number,
    min: 0,
  },
  vehicle: {
    plateNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    make: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 200,
  },
}, { timestamps: true });

export default mongoose.model('Ride', rideSchema);