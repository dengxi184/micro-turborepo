const express = require('express');
const authRouter = require('./auth');
const uploadRouter = require('./upload');
const articleRouter = require('./article');
const planRouter = require('./plan');

const app = express();

app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/article', articleRouter);
app.use('/plan', planRouter);

module.exports = app;
