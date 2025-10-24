const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        // Conversation participants
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },

        // Related entities (optional context)
        relatedRide: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
        },
        relatedBooking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },

        // Message content
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },

        // Message type
        messageType: {
            type: String,
            enum: ['text', 'system', 'location', 'image'],
            default: 'text',
        },

        // For location messages
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: [Number], // [longitude, latitude]
        },

        // For image messages
        imageUrl: {
            type: String,
        },

        // Read status
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
        },

        // Delivery status
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: {
            type: Date,
        },

        // Conversation ID (to group messages)
        conversationId: {
            type: String,
            required: true,
            index: true,
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

// Pre-save hook to generate conversationId
messageSchema.pre('save', function (next) {
    if (!this.conversationId) {
        // Create a consistent conversation ID between two users
        const ids = [this.sender.toString(), this.recipient.toString()].sort();
        this.conversationId = `${ids[0]}_${ids[1]}`;
    }
    next();
});

// Method to mark as read
messageSchema.methods.markAsRead = function () {
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function () {
    if (!this.isDelivered) {
        this.isDelivered = true;
        this.deliveredAt = new Date();
        return this.save();
    }
    return Promise.resolve(this);
};

// Static method to get conversation between two users
messageSchema.statics.getConversation = function (userId1, userId2, limit = 50, skip = 0) {
    const ids = [userId1.toString(), userId2.toString()].sort();
    const conversationId = `${ids[0]}_${ids[1]}`;

    return this.find({
        conversationId,
        'metadata.deleted': { $ne: true },
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('sender', 'name avatar')
        .populate('recipient', 'name avatar')
        .exec();
};

// Static method to get unread count for user
messageSchema.statics.getUnreadCount = function (userId) {
    return this.countDocuments({
        recipient: userId,
        isRead: false,
        'metadata.deleted': { $ne: true },
    });
};

// Static method to mark all messages in conversation as read
messageSchema.statics.markConversationAsRead = function (userId, otherUserId) {
    const ids = [userId.toString(), otherUserId.toString()].sort();
    const conversationId = `${ids[0]}_${ids[1]}`;

    return this.updateMany(
        {
            conversationId,
            recipient: userId,
            isRead: false,
        },
        {
            $set: { isRead: true, readAt: new Date() },
        }
    );
};

// Static method to get all conversations for a user
messageSchema.statics.getUserConversations = async function (userId) {
    const result = await this.aggregate([
        {
            $match: {
                $or: [{ sender: mongoose.Types.ObjectId(userId) }, { recipient: mongoose.Types.ObjectId(userId) }],
                'metadata.deleted': { $ne: true },
            },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $group: {
                _id: '$conversationId',
                lastMessage: { $first: '$$ROOT' },
                unreadCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                                    { $eq: ['$isRead', false] },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        {
            $sort: { 'lastMessage.createdAt': -1 },
        },
    ]);

    return result;
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
