// Central export file for all models

const Passenger = require('./Passenger');
const Driver = require('./Driver');
const Ride = require('./Ride');
const Booking = require('./Booking');
const Request = require('./Request');
const Rating = require('./Rating');
const Notification = require('./Notification');
const Message = require('./Message');

module.exports = {
    Passenger,
    Driver,
    Ride,
    Booking,
    Request,
    Rating,
    Notification,
    Message,
};
