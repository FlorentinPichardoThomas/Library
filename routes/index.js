const express = require('express');
const router = express.Router();
const passport = require('passport');
const booksCtrl = require('../controllers/books')
// const usernameCtrl = require('../controllers/passport-local-config')
const isSignedIn = require('../config/auth2')
const Username = require('../models/username');

router.get('/', function(req, res, next) {
  res.redirect('/books');
});

router.get('/books/sorry', function(req,res, next){
  res.render('books/sorry')
})

router.get('/books/categories', function(req, res, next){
  res.render('books/categories', {title: "Categories"})
})


// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/books',
    failureRedirect : '/auth/google'
  }
));

// OAuth logout route
router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});


module.exports = router;