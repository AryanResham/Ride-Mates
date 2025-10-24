const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: false,
            unique: true,
            index: true,
        },

        passwordHash: {
            type: String,
            required: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },

        // Profile Information
        avatar: {
            type: String,
            default: null,
        },

        // Rating and Statistics
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
        },

        // Statistics
        stats: {
            totalRides: {
                type: Number,
                default: 0,
            },
            totalSpent: {
                type: Number,
                default: 0,
            },
            moneySaved: {
                type: Number,
                default: 0,
            },
            completionRate: {
                type: Number,
                default: 100,
                min: 0,
                max: 100,
            },
        },

        // Account Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        // Preferences
        preferences: {
            notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
                push: { type: Boolean, default: true },
            },
            ridePreferences: {
                allowSmoking: { type: Boolean, default: false },
                allowPets: { type: Boolean, default: false },
                preferMusic: { type: Boolean, default: true },
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
passengerSchema.index({ email: 1 });
passengerSchema.index({ firebaseUid: 1 });
passengerSchema.index({ 'rating.average': -1 });

// Method to update rating
passengerSchema.methods.updateRating = function (newRating) {
    this.rating.total += newRating;
    this.rating.count += 1;
    this.rating.average = this.rating.total / this.rating.count;
    return this.save();
};

// Method to increment ride count
passengerSchema.methods.incrementRideCount = function () {
    this.stats.totalRides += 1;
    return this.save();
};

// Method to update spending
passengerSchema.methods.updateSpending = function (amount) {
    this.stats.totalSpent += amount;
    return this.save();
};

// Method to update money saved
passengerSchema.methods.updateMoneySaved = function (amount) {
    this.stats.moneySaved += amount;
    return this.save();
};

const Passenger = mongoose.model('Passenger', passengerSchema);

module.exports = Passenger;
