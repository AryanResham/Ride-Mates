import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
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
        role: {
            passenger: {
                type: Boolean,
                default: true
            },
            driver: {
                type: Boolean,
                default: false
            },
            admin: {
                type: Boolean,
                default: false
            }
        },
        avatar: {
            type: String,
            default: null,
        },

        // Driver Specific Information
        vehicle: {
            model: {
                type: String,
                trim: true,
            },
            plateNumber: {
                type: String,
                trim: true,
            },
            color: {
                type: String,
                trim: true,
            },
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
            totalRidesAsDriver: {
                type: Number,
                default: 0,
            },
            totalRidesAsPassenger: {
                type: Number,
                default: 0,
            },
            totalEarnings: {
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
        isDriver: {
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
            autoAcceptRequests: {
                type: Boolean,
                default: false,
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
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });
userSchema.index({ 'rating.average': -1 });

// Virtual for full vehicle info
userSchema.virtual('vehicleInfo').get(function () {
    if (this.vehicle && this.vehicle.model) {
        return `${this.vehicle.model} (${this.vehicle.plateNumber})`;
    }
    return null;
});

// Method to update rating
userSchema.methods.updateRating = function (newRating) {
    this.rating.total += newRating;
    this.rating.count += 1;
    this.rating.average = this.rating.total / this.rating.count;
    return this.save();
};

// Method to increment ride count
userSchema.methods.incrementRideCount = function (asDriver = false) {
    this.stats.totalRides += 1;
    if (asDriver) {
        this.stats.totalRidesAsDriver += 1;
    } else {
        this.stats.totalRidesAsPassenger += 1;
    }
    return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
