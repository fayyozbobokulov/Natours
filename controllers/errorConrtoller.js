const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/gi)[0];
  // console.log(value);
  const message = `Diplicate field value: ${value}. Please use another value instead!`;

  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError(`Invalid token.Please log in again${err}`, 401);

const handleJWTExpiredError = (err) =>
  new AppError(`Your token has expired please login${err}`, 401);

const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data!. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    err: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operatinal Error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other type of error
  } else {
    // 1 Log error
    console.log('Error ', err);
    // 2 Send Generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log('Production error should be seen');
    console.log(err);
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDublicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidateErrorDB(error);
    if (error.name === 'JsonWebtokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    sendErrorProd(err, res);
  }
};
