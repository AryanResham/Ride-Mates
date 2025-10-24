// Central export file for all models

const User = require('./User');
const Ride = require('./Ride');
const Booking = require('./Booking');
const Request = require('./Request');
const Rating = require('./Rating');
const Notification = require('./Notification');
const Message = require('./Message');

module.exports = {
    User,
    Ride,
    Booking,
    Request,
    Rating,
    Notification,
    Message,
};
