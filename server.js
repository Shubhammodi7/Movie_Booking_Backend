const express = require('express');
require('dotenv').config({debug: true});
const bodyParser = require('body-parser');
const dotenvResult = require('dotenv').config()
const { PORT } = dotenvResult.parsed || {}
const { NODE_ENV } = dotenvResult.parsed || {}
const cookieParser = require('cookie-parser')
require('dotenv').config()
const morgan = require('morgan');
const logger = require('./utils/logger')

const app = express();

const initBookingCron = require('./utils/booking.cron');
initBookingCron();

app.use(morgan('dev', {
  stream: { write: (message) => logger.info(message.trim()) }
}));
app.use(express.json()); // This parses the incoming JSON

const movieRoutes = require('./routes/movie.routes')
const theatreRoutes = require('./routes/theatre.routes')
const showRoutes = require('./routes/show.routes');
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const connectToDb = require('./config/db');
connectToDb();



app.use('/mba/api/v1', movieRoutes);
app.use('/mba/api/v1', theatreRoutes);
app.use('/mba/api/v1', showRoutes);
app.use('/mba/api/v1', authRoutes);
app.use('/mba/api/v1', bookingRoutes);
app.use('/mba/api/v1', paymentRoutes);



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: NODE_ENV === 'production' ? null : err.stack,
  })
})



const port = PORT || 2000;
app.listen(port, () => {
  logger.info(`🚀 Server running in ${NODE_ENV} mode on port http://localhost:${PORT}`);
});