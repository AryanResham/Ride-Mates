import mongoose from 'mongoose';
// Driver offers a ride to passengers
const rideSchema = new mongoose.Schema(
    {
        // Driver Information
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Route Information
        from: {
            type: String,
            required: true,
            trim: true,
        },
        to: {
            type: String,
            required: true,
            trim: true,
        },

        // Location coordinates (for future geolocation features)
        fromLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },
        toLocation: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            },
        },

        // Schedule Information
        date: {
            type: Date,
            required: true,
            index: true,
        },
        time: {
            type: String,
            required: true,
        },

        // Full DateTime for easier querying
        departureDateTime: {
            type: Date,
            required: true,
            index: true,
        },

        // Ride Details
        availableSeats: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
        },
        totalSeats: {
            type: Number,
            required: true,
            min: 1,
            max: 8,
        },
        pricePerSeat: {
            type: Number,
            required: true,
            min: 0,
        },

        // Vehicle Information
        vehicle: {
            type: String,
            required: true,
            trim: true,
        },

        // Additional Information
        notes: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Trip Details
        distance: {
            type: String,
            trim: true,
        },
        duration: {
            type: String,
            trim: true,
        },

        // Bookings (references to passenger bookings)
        bookings: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        }],

        // Status
        status: {
            type: String,
            enum: ['upcoming', 'in-progress', 'completed', 'cancelled'],
            default: 'upcoming',
            index: true,
        },

        // Ride Preferences
        preferences: {
            allowSmoking: {
                type: Boolean,
                default: false,
            },
            allowPets: {
                type: Boolean,
                default: false,
            },
            allowMusic: {
                type: Boolean,
                default: true,
            },
            baggageAllowed: {
                type: Boolean,
                default: true,
            },
        },

        // Financial
        totalEarnings: {
            type: Number,
            default: 0,
        },

        // Draft status
        isDraft: {
            type: Boolean,
            default: false,
        },

        // Cancellation info
        cancellationReason: {
            type: String,
            trim: true,
        },
        cancelledAt: {
            type: Date,
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ departureDateTime: 1, status: 1 });
rideSchema.index({ from: 1, to: 1, date: 1 });
rideSchema.index({ fromLocation: '2dsphere' });
rideSchema.index({ toLocation: '2dsphere' });

// Virtual for occupied seats
rideSchema.virtual('occupiedSeats').get(function () {
    return this.totalSeats - this.availableSeats;
});

// Virtual for route
rideSchema.virtual('route').get(function () {
    return `${this.from} → ${this.to}`;
});

// Method to book seats
rideSchema.methods.bookSeats = function (numberOfSeats) {
    if (this.availableSeats >= numberOfSeats) {
        this.availableSeats -= numberOfSeats;
        this.totalEarnings += this.pricePerSeat * numberOfSeats;
        return this.save();
    }
    throw new Error('Not enough seats available');
};

// Method to release seats (when booking is cancelled)
rideSchema.methods.releaseSeats = function (numberOfSeats) {
    this.availableSeats += numberOfSeats;
    this.totalEarnings -= this.pricePerSeat * numberOfSeats;
    return this.save();
};

// Method to check if ride is full
rideSchema.methods.isFull = function () {
    return this.availableSeats === 0;
};

// Method to check if ride is in the past
rideSchema.methods.isPast = function () {
    return this.departureDateTime < new Date();
};

// Pre-save hook to set departureDateTime
rideSchema.pre('save', function (next) {
    if (this.isModified('date') || this.isModified('time')) {
        const [hours, minutes] = this.time.split(':');
        const dateTime = new Date(this.date);
        dateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        this.departureDateTime = dateTime;
    }
    next();
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;
