const cron = require('node-cron');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');
const logger = require('./logger');

const initBookingCron = () => {
  cron.schedule('0 */10 * * *', async () => {
    try {
      logger.info('--- Cron Job Started: Updating Expired Bookings ---');
      
      const pastShows = await Show.find({ datetime: { $lt: new Date() } }).select('_id');
      const showIds = pastShows.map(s => s._id);

      const result = await Booking.updateMany(
        { show: { $in: showIds }, status: 'BOOKED' },
        { $set: { status: 'EXPIRED' } }
      );

      logger.info(`--- Cron Job Finished: ${result.modifiedCount} bookings updated ---`);
    } catch (error) {
      logger.error('Cron Job Error:', error);
    }
  });
};

module.exports = initBookingCron;