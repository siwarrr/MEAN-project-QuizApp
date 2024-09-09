const mongoose = require('mongoose');
require('dotenv').config(); 

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Current Database:', mongoose.connection.db.databaseName); 
  })
  .catch(err => console.error('MongoDB connection error:', err));
