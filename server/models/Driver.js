import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema(
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
            required: true,
            trim: true,
        },

        // Profile Information
        avatar: {
            type: String,
            default: null,
        },

        // Driver Specific Information
        vehicle: {
            model: {
                type: String,
                required: true,
                trim: true,
            },
            plateNumber: {
                type: String,
                required: true,
                trim: true,
                unique: true,
            },
            color: {
                type: String,
                required: true,
                trim: true,
            },
            capacity: {
                type: Number,
                required: true,
                min: 1,
                max: 8,
            },
        },

        // License Information
        license: {
            number: {
                type: String,
                required: true,
                trim: true,
                unique: true,
            },
            expiryDate: {
                type: Date,
                required: true,
            },
            verified: {
                type: Boolean,
                default: false,
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
            totalEarnings: {
                type: Number,
                default: 0,
            },
            completionRate: {
                type: Number,
                default: 100,
                min: 0,
                max: 100,
            },
            totalDistance: {
                type: Number,
                default: 0,
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
        isApproved: {
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
            ridePreferences: {
                allowSmoking: { type: Boolean, default: false },
                allowPets: { type: Boolean, default: false },
                allowMusic: { type: Boolean, default: true },
                baggageAllowed: { type: Boolean, default: true },
            },
        },

        // Availability
        availability: {
            isAvailable: {
                type: Boolean,
                default: true,
            },
            lastActive: {
                type: Date,
                default: Date.now,
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
driverSchema.index({ email: 1 });
driverSchema.index({ firebaseUid: 1 });
driverSchema.index({ 'rating.average': -1 });
driverSchema.index({ 'vehicle.plateNumber': 1 });
driverSchema.index({ 'license.number': 1 });

// Virtual for full vehicle info
driverSchema.virtual('vehicleInfo').get(function () {
    if (this.vehicle && this.vehicle.model) {
        return `${this.vehicle.color} ${this.vehicle.model} (${this.vehicle.plateNumber})`;
    }
    return null;
});

// Virtual to check if license is valid
driverSchema.virtual('isLicenseValid').get(function () {
    if (this.license && this.license.expiryDate) {
        return new Date(this.license.expiryDate) > new Date();
    }
    return false;
});

// Method to update rating
driverSchema.methods.updateRating = function (newRating) {
    this.rating.total += newRating;
    this.rating.count += 1;
    this.rating.average = this.rating.total / this.rating.count;
    return this.save();
};

// Method to increment ride count
driverSchema.methods.incrementRideCount = function () {
    this.stats.totalRides += 1;
    return this.save();
};

// Method to update earnings
driverSchema.methods.updateEarnings = function (amount) {
    this.stats.totalEarnings += amount;
    return this.save();
};

// Method to update distance
driverSchema.methods.updateDistance = function (distance) {
    this.stats.totalDistance += distance;
    return this.save();
};

// Method to update availability
driverSchema.methods.updateAvailability = function (isAvailable) {
    this.availability.isAvailable = isAvailable;
    this.availability.lastActive = new Date();
    return this.save();
};

const Driver = mongoose.model('Driver', driverSchema);

export default Driver;
