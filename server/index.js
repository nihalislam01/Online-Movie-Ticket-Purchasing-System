const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user');
const movieRoute = require('./routes/movie');
const reviewRoute = require('./routes/review');
const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/movie', movieRoute);
app.use('/review', reviewRoute);

module.exports = app;