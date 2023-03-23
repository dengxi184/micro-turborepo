const express = require('express');
const authRouter = require('./auth');
const uploadRouter = require('./upload');
const articleRouter = require('./article');

const app = express();

app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/article', articleRouter);

module.exports = app;
