const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books')
const commentCtrl = require('../controllers/comments');
const isLoggedIn = require('../config/auth');

// Read comments for a book
router.get('/books/:id/comments',isLoggedIn, commentCtrl.readComments);

// Create a new comment for a book
router.post('/books/:id/comments', isLoggedIn, commentCtrl.createComments);

// Show updated comments form
//router.get('/books/:bookId/comments/:commentId/edit', isLoggedIn, booksCtrl.show);



// Update a comment for a book
//router.put('/comments/:id', isLoggedIn, commentCtrl.checkCommentOwnership, commentCtrl.updateComments);

module.exports = router;
