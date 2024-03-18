const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const config = require('./utils/config');
require('express-async-errors');

const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter);

module.exports = app;
