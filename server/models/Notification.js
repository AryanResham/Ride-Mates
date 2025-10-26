import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        // Recipient
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Notification Type
        type: {
            type: String,
            enum: [
                'booking_request',
                'booking_confirmed',
                'booking_cancelled',
                'booking_rejected',
                'ride_reminder',
                'ride_cancelled',
                'rating_received',
                'payment_received',
                'payment_processed',
                'message_received',
                'request_accepted',
                'request_declined',
                'ride_full',
                'ride_starting_soon',
                'system_announcement',
            ],
            required: true,
            index: true,
        },

        // Content
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },

        // Related entities
        relatedRide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
        },
        relatedBooking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        relatedRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Request',
        },
        relatedUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        // Action link/data
        actionUrl: {
            type: String,
            trim: true,
        },
        actionType: {
            type: String,
            enum: ['view_ride', 'view_booking', 'view_request', 'view_profile', 'rate_ride', 'none'],
            default: 'none',
        },

        // Status
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
        },

        // Priority
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },

        // Channel preferences
        channels: {
            push: {
                type: Boolean,
                default: true,
            },
            email: {
                type: Boolean,
                default: false,
            },
            sms: {
                type: Boolean,
                default: false,
            },
        },

        // Delivery status
        deliveryStatus: {
            push: {
                sent: { type: Boolean, default: false },
                sentAt: { type: Date },
                error: { type: String },
            },
            email: {
                sent: { type: Boolean, default: false },
                sentAt: { type: Date },
                error: { type: String },
            },
            sms: {
                sent: { type: Boolean, default: false },
                sentAt: { type: Date },
                error: { type: String },
            },
        },

        // Expiration
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to mark delivery status
notificationSchema.methods.markDelivered = function (channel, success, error = null) {
    if (this.deliveryStatus && this.deliveryStatus[channel]) {
        this.deliveryStatus[channel].sent = success;
        this.deliveryStatus[channel].sentAt = new Date();
        if (error) {
            this.deliveryStatus[channel].error = error;
        }
        return this.save();
    }
    return Promise.resolve(this);
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function (userId) {
    return this.countDocuments({ user: userId, isRead: false });
};

// Static method to mark all as read for user
notificationSchema.statics.markAllAsReadForUser = function (userId) {
    return this.updateMany(
        { user: userId, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
    );
};

// Static method to get recent notifications
notificationSchema.statics.getRecentForUser = function (userId, limit = 20) {
    return this.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('relatedUser', 'name avatar')
        .exec();
};

// Static method to create booking request notification
notificationSchema.statics.createBookingRequest = function (driverId, booking, passenger) {
    return this.create({
        user: driverId,
        type: 'booking_request',
        title: 'New Booking Request',
        message: `${passenger.name} requested to book ${booking.seatsBooked} seat(s) for your ride`,
        relatedBooking: booking._id,
        relatedUser: passenger._id,
        actionType: 'view_request',
        priority: 'high',
    });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
