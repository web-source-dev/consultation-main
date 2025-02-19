const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// Allow all origins and methods
app.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const api = require('./routes/api');
const lead = require('./routes/leadapi');

app.use('/api', api);
app.use('/lead', lead);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
