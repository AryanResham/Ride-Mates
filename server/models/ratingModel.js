import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    validate: {
      validator: Number.isSafeInteger,
      message: 'Rating must be a whole number'
    }
  },
  rideRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true,
  },
  reviewType: {
    type: String,
    enum: ['driver', 'passenger'],
    required: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
});

// Compound index to prevent duplicate ratings for the same ride
ratingSchema.index({ reviewer: 1, reviewedUser: 1, rideRef: 1 }, { unique: true });

// Virtual to format rating display
ratingSchema.virtual('ratingDisplay').get(function() {
  return `${this.rating}/10 stars`;
});

// Validation to prevent self-rating
ratingSchema.pre('save', function(next) {
  if (this.reviewer.equals(this.reviewedUser)) {
    next(new Error('Users cannot rate themselves'));
  } else {
    next();
  }
});

export default mongoose.model('Rating', ratingSchema);