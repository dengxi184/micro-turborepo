const express = require('express');
const authRouter = require('./auth');
const uploadRouter = require('./upload');

const app = express();

app.use('/auth', authRouter);
app.use('/upload', uploadRouter);

module.exports = app;
