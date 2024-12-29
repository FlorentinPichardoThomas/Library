const createError = require('http-errors');
const express = require('express');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('express-flash');
const mongoose = require('mongoose');

// Load environment variables and configurations
require('dotenv').config();
require('./config/database');
require('./config/passport');

// Middleware and route imports
const isLoggedIn = require('./config/auth');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');
const reviewersRouter = require('./routes/comments');
const usernameRouter = require('./routes/username');

// Initialize Express application
const app = express();

// View Engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(bodyParser.json());

// Session setup
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Global variable for user in views
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Route setup
app.use('/', usernameRouter);
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/', reviewersRouter);
app.use(function(req,res,next){'/books'})

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Global error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Mongoose configuration
mongoose.set('strictQuery', true);

// Prevent max listeners warning
require('events').EventEmitter.defaultMaxListeners = 15;

// Export app
module.exports = app;
