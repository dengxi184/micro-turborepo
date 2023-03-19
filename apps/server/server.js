const express = require('express');
const path = require('path');
const apiRouter = require('./routes/api');

const MONGODB_URL = 'mongodb://localhost:27017/express-micro'; //process.env.MONGODB_URL;
const mongoose = require('mongoose');

const app = express();
// 配置cros跨域请求中间件
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/api', apiRouter);

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    //don't show the log when it is test
    if (process.env.NODE_ENV !== 'test') {
      console.log('Connected to %s', MONGODB_URL);
      console.log('App is running ... \n');
      app.listen(9000, () => {
        console.log('端口监听: 9000');
        console.log('Press CTRL + C to stop the process. \n');
      });
    }
  })
  .catch((err) => {
    console.error('App starting error:', err.message);
    process.exit(1);
  });

module.exports = app;
