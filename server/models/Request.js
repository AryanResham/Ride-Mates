import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
    {
        // Same as Booking - this is for ride requests that need approval
        // References
        ride: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
            required: true,
            index: true,
        },
        passenger: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Request Details
        seatsRequested: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },

        // Message from passenger
        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Cached ride information
        rideInfo: {
            from: String,
            to: String,
            date: Date,
            time: String,
            pricePerSeat: Number,
        },

        // Status
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', 'expired'],
            default: 'pending',
            index: true,
        },

        // Response from driver
        driverResponse: {
            type: String,
            trim: true,
            maxlength: 300,
        },
        respondedAt: {
            type: Date,
        },

        // Expiration
        expiresAt: {
            type: Date,
            index: true,
        },

        // Tracking
        viewedByDriver: {
            type: Boolean,
            default: false,
        },
        viewedAt: {
            type: Date,
        },

        // If accepted, link to created booking
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
requestSchema.index({ driver: 1, status: 1 });
requestSchema.index({ passenger: 1, status: 1 });
requestSchema.index({ ride: 1, status: 1 });
requestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
requestSchema.index({ createdAt: -1 });

// Virtual for ride route
requestSchema.virtual('route').get(function () {
    if (this.rideInfo) {
        return `${this.rideInfo.from} → ${this.rideInfo.to}`;
    }
    return null;
});

// Virtual for total price
requestSchema.virtual('totalPrice').get(function () {
    if (this.rideInfo && this.rideInfo.pricePerSeat) {
        return this.rideInfo.pricePerSeat * this.seatsRequested;
    }
    return 0;
});

// Pre-save hook to set expiration time
requestSchema.pre('save', function (next) {
    if (this.isNew && !this.expiresAt && this.rideInfo && this.rideInfo.date) {
        // Request expires 24 hours before the ride
        const rideDate = new Date(this.rideInfo.date);
        this.expiresAt = new Date(rideDate.getTime() - 24 * 60 * 60 * 1000);
    }
    next();
});

// Method to accept request
requestSchema.methods.accept = function (driverResponse) {
    this.status = 'accepted';
    this.driverResponse = driverResponse;
    this.respondedAt = new Date();
    return this.save();
};

// Method to decline request
requestSchema.methods.decline = function (driverResponse) {
    this.status = 'declined';
    this.driverResponse = driverResponse;
    this.respondedAt = new Date();
    return this.save();
};

// Method to mark as viewed by driver
requestSchema.methods.markAsViewed = function () {
    if (!this.viewedByDriver) {
        this.viewedByDriver = true;
        this.viewedAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

// Static method to expire old requests
requestSchema.statics.expireOldRequests = async function () {
    const now = new Date();
    return this.updateMany(
        {
            status: 'pending',
            expiresAt: { $lt: now },
        },
        {
            $set: { status: 'expired' },
        }
    );
};

// Static method to get pending count for driver
requestSchema.statics.getPendingCountForDriver = function (driverId) {
    return this.countDocuments({ driver: driverId, status: 'pending' });
};

const Request = mongoose.model('Request', requestSchema);

export default Request;