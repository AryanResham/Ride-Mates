import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true, // Firebase UID is now the primary identifier
            unique: true,
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
        avatar: {
            type: String,
            default: null,
        },
        
        // Driver-specific information, only present if the user provides vehicle details
        driverProfile: {
            vehicle: {
                model: String,
                plateNumber: { type: String, unique: true, sparse: true },
            },
            availability: {
                isAvailable: { type: Boolean, default: true },
                lastActive: { type: Date, default: Date.now },
            },
        },

        // Combined rating for the user
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },

        // Combined statistics
        stats: {
            totalRidesAsDriver: { type: Number, default: 0 },
            totalRidesAsPassenger: { type: Number, default: 0 },
            totalEarnings: { type: Number, default: 0 }, // as Driver
            totalSpent: { type: Number, default: 0 }, // as Passenger
            completionRate: { type: Number, default: 100, min: 0, max: 100 },
        },

        // Account Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isVerified: { // e.g., email or phone verified
            type: Boolean,
            default: false,
        },

        // User Preferences
        preferences: {
            notifications: {
                email: { type: Boolean, default: true },
                sms: { type: Boolean, default: false },
                push: { type: Boolean, default: true },
            },
            ridePreferences: { // As a passenger
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

// Virtual to check if a user is a driver
userSchema.virtual('isDriver').get(function () {
    return this.driverProfile && this.driverProfile.vehicle && this.driverProfile.vehicle.plateNumber;
});

// Virtual for full vehicle info
userSchema.virtual('vehicleInfo').get(function () {
    if (this.isDriver) {
        return `${this.driverProfile.vehicle.model} (${this.driverProfile.vehicle.plateNumber})`;
    }
    return null;
});

// Method to update rating
userSchema.methods.updateRating = function (newRating) {
    const total = (this.rating.average * this.rating.count) + newRating;
    this.rating.count += 1;
    this.rating.average = total / this.rating.count;
    return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
