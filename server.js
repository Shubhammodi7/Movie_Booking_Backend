const express = require('express');
require('dotenv').config({debug: true});
const bodyParser = require('body-parser');

const app = express();

app.use(express.json()); // This parses the incoming JSON

const movieRoutes = require('./routes/movie.routes')
const theatreRoutes = require('./routes/theatre.routes')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connectToDb = require('./config/db');
connectToDb();



app.use('/mba/api/v1', movieRoutes);
app.use('/mba/api/v1', theatreRoutes);







const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})