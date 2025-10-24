const mongoose = require('mongoose');
// Booking made by passengers for rides
const bookingSchema = new mongoose.Schema(
    {
        // References
        ride: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
            required: true,
            index: true,
        },
        passenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Passenger',
            required: true,
            index: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Driver',
            required: true,
        },

        // Booking Details
        seatsBooked: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        // Pricing
        pricePerSeat: {
            type: Number,
            required: true,
            min: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // Status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
            default: 'pending',
            index: true,
        },

        // Passenger Message
        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Booking Information (cached from ride for historical purposes)
        rideDetails: {
            from: String,
            to: String,
            date: Date,
            time: String,
            vehicle: String,
        },

        // Payment Information
        payment: {
            status: {
                type: String,
                enum: ['pending', 'completed', 'refunded', 'failed'],
                default: 'pending',
            },
            method: {
                type: String,
                enum: ['cash', 'card', 'upi', 'wallet'],
            },
            transactionId: {
                type: String,
            },
            paidAt: {
                type: Date,
            },
        },

        // Ratings
        ratings: {
            passengerRatedDriver: {
                type: Boolean,
                default: false,
            },
            driverRatedPassenger: {
                type: Boolean,
                default: false,
            },
            passengerRating: {
                type: Number,
                min: 1,
                max: 5,
            },
            driverRating: {
                type: Number,
                min: 1,
                max: 5,
            },
            passengerReview: {
                type: String,
                trim: true,
                maxlength: 500,
            },
            driverReview: {
                type: String,
                trim: true,
                maxlength: 500,
            },
        },

        // Cancellation Details
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancelledBy: {
            type: String,
            enum: ['passenger', 'driver', 'system'],
        },
        cancelledAt: {
            type: Date,
        },

        // Pickup/Drop Details
        pickupPoint: {
            type: String,
            trim: true,
        },
        dropPoint: {
            type: String,
            trim: true,
        },

        // Confirmation
        confirmedAt: {
            type: Date,
        },
        completedAt: {
            type: Date,
        },

        // Special Requests
        specialRequests: {
            type: String,
            trim: true,
            maxlength: 300,
        },

        // Booking ID for reference
        bookingId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
bookingSchema.index({ passenger: 1, status: 1 });
bookingSchema.index({ ride: 1, status: 1 });
bookingSchema.index({ driver: 1, status: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for route display
bookingSchema.virtual('route').get(function () {
    if (this.rideDetails) {
        return `${this.rideDetails.from} → ${this.rideDetails.to}`;
    }
    return null;
});

// Pre-save hook to generate bookingId if not exists
bookingSchema.pre('save', function (next) {
    if (!this.bookingId) {
        this.bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
    next();
});

// Method to confirm booking
bookingSchema.methods.confirm = function () {
    this.status = 'confirmed';
    this.confirmedAt = new Date();
    return this.save();
};

// Method to complete booking
bookingSchema.methods.complete = function () {
    this.status = 'completed';
    this.completedAt = new Date();
    return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancel = function (cancelledBy, reason) {
    this.status = 'cancelled';
    this.cancelledBy = cancelledBy;
    this.cancellationReason = reason;
    this.cancelledAt = new Date();
    return this.save();
};

// Method to reject booking
bookingSchema.methods.reject = function (reason) {
    this.status = 'rejected';
    this.cancellationReason = reason;
    return this.save();
};

// Static method to get pending bookings count for a driver
bookingSchema.statics.getPendingCountForDriver = function (driverId) {
    return this.countDocuments({ driver: driverId, status: 'pending' });
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
