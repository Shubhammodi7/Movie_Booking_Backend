const express = require('express');
require('dotenv').config({debug: true});
const bodyParser = require('body-parser');
const dotenvResult = require('dotenv').config()
const { PORT } = dotenvResult.parsed || {}
const cookieParser = require('cookie-parser')

const app = express();

const initBookingCron = require('./utils/booking.cron');
initBookingCron();

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







const port = PORT || 2000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
})