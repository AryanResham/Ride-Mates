const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
    {
        // References
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        ride: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
            required: true,
        },

        // Who is rating whom
        rater: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        ratee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Rating type
        raterRole: {
            type: String,
            enum: ['driver', 'passenger'],
            required: true,
        },

        // Rating Details
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        // Review
        review: {
            type: String,
            trim: true,
            maxlength: 500,
        },

        // Specific ratings (optional detailed breakdown)
        detailedRatings: {
            punctuality: {
                type: Number,
                min: 1,
                max: 5,
            },
            communication: {
                type: Number,
                min: 1,
                max: 5,
            },
            cleanliness: {
                type: Number,
                min: 1,
                max: 5,
            },
            driving: {
                // Only for rating drivers
                type: Number,
                min: 1,
                max: 5,
            },
            behavior: {
                type: Number,
                min: 1,
                max: 5,
            },
        },

        // Visibility
        isPublic: {
            type: Boolean,
            default: true,
        },

        // Response from ratee
        response: {
            type: String,
            trim: true,
            maxlength: 300,
        },
        respondedAt: {
            type: Date,
        },

        // Moderation
        isFlagged: {
            type: Boolean,
            default: false,
        },
        flagReason: {
            type: String,
            trim: true,
        },

        // Helpful votes
        helpfulCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
ratingSchema.index({ ratee: 1, createdAt: -1 });
ratingSchema.index({ rater: 1, createdAt: -1 });
ratingSchema.index({ booking: 1 });
ratingSchema.index({ ride: 1 });

// Compound index to ensure one rating per person per booking
ratingSchema.index({ booking: 1, rater: 1 }, { unique: true });

// Virtual for average of detailed ratings
ratingSchema.virtual('detailedAverage').get(function () {
    const ratings = [];
    if (this.detailedRatings) {
        if (this.detailedRatings.punctuality) ratings.push(this.detailedRatings.punctuality);
        if (this.detailedRatings.communication) ratings.push(this.detailedRatings.communication);
        if (this.detailedRatings.cleanliness) ratings.push(this.detailedRatings.cleanliness);
        if (this.detailedRatings.driving) ratings.push(this.detailedRatings.driving);
        if (this.detailedRatings.behavior) ratings.push(this.detailedRatings.behavior);
    }

    if (ratings.length === 0) return null;
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
});

// Method to add response
ratingSchema.methods.addResponse = function (response) {
    this.response = response;
    this.respondedAt = new Date();
    return this.save();
};

// Method to flag rating
ratingSchema.methods.flag = function (reason) {
    this.isFlagged = true;
    this.flagReason = reason;
    return this.save();
};

// Method to increment helpful count
ratingSchema.methods.incrementHelpful = function () {
    this.helpfulCount += 1;
    return this.save();
};

// Static method to get average rating for a user
ratingSchema.statics.getAverageForUser = async function (userId) {
    const result = await this.aggregate([
        {
            $match: { ratee: mongoose.Types.ObjectId(userId) },
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalRatings: { $sum: 1 },
            },
        },
    ]);

    if (result.length > 0) {
        return {
            average: Math.round(result[0].averageRating * 10) / 10,
            count: result[0].totalRatings,
        };
    }

    return { average: 0, count: 0 };
};

// Static method to get recent ratings for a user
ratingSchema.statics.getRecentForUser = function (userId, limit = 10) {
    return this.find({ ratee: userId, isPublic: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('rater', 'name avatar')
        .exec();
};

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
