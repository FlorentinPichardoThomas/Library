const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user').User
const bcrypt = require('bcrypt')

const initializePassport = require('../config/passport-config')
initializePassport(
  passport,
  async (email) => {
    try {
      const user = await User.findOne({ email: email }); // Find user by email using the User model
      return user; // Return the found user
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null; // Return null if an error occurs
    }
  },
  async (userId) => {
    try {
      const user = await User.findById(userId); // Find user by ID using the User model
      return user; // Return the found user
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null; // Return null if an error occurs
    }
  }
);
/////////////////////////////////////////////////////////////////////////////////////
require('dotenv').config()

const express = require('express');
const router = express.Router();
const usernameCtrl = require('../controllers/user');
const auth = require('../config/auth2');
const jwt = require('jsonwebtoken');
const { LocalUser } = require('../models/user');


// Login and Registration routes
router.get('/login', usernameCtrl.loginPage,checkNotAuthenticated)
router.post('/login' ,checkNotAuthenticated, 
  passport.authenticate('local', {
      successRedirect: '/books',
      failureRedirect: '/login',
      failureFlash: true,
    }))

router.get('/register', usernameCtrl.registrationPage, checkNotAuthenticated);
router.post('/register', checkNotAuthenticated, usernameCtrl.registration);

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/books')
  }
  next()
}

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router