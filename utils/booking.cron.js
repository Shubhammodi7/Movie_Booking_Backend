const cron = require('node-cron');
const Booking = require('../models/booking.model');
const Show = require('../models/show.model');

const initBookingCron = () => {
  cron.schedule('0 */10 * * *', async () => {
    try {
      console.log('--- Cron Job Started: Updating Expired Bookings ---');
      
      const pastShows = await Show.find({ datetime: { $lt: new Date() } }).select('_id');
      const showIds = pastShows.map(s => s._id);

      const result = await Booking.updateMany(
        { show: { $in: showIds }, status: 'BOOKED' },
        { $set: { status: 'EXPIRED' } }
      );

      console.log(`--- Cron Job Finished: ${result.modifiedCount} bookings updated ---`);
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};

module.exports = initBookingCron;