/* eslint-disable no-console */
const createError = require('http-errors');
const express = require('express');
const path = require('path');

const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const cors = require('cors');
// const indexRouter = require('./routes/index');
const usersRouter = require('./api/v1/users/userRoute');
const productRouter = require('./api/v1/products/productRoute');
const orderRouter = require('./api/v1/orders/orderRoute');
const config = require('./config')();

mongoose.connect(config.db, (err) => {
  if (err) {
    console.log('failed to connect to the db because: ', err);
  } else {
    console.log('connected to the database');
  }
});

mongoose.set('debug', true);

const app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
require('./api/v1/strategies/authStrategy')(passport);

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
