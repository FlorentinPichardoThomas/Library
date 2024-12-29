const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const commentCtrl = require('../controllers/comments')
const isSignedIn = require('../config/auth2')
const isLoggedIn = require('../config/auth');
const Book = require('../models/book')

//Multer Code
const multer = require('multer')

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  };

const storage = multer.memoryStorage()
  
const upload = multer({
     storage: storage,
     fileFilter: multerFilter
    })

    function uploadUserPhoto1(req, res, next) {
        upload.single('bookCoverImage')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.error('Multer Error:', err);
                return res.status(400).send('Multer Error');
            } else if (err) {
                console.log("Unknown Error:", err)
                console.error('Unknown Error:', err);
                return res.status(500).send('Unknown Error');
            }
    
            // Log the req.files array, including the buffers
            console.log("Upload Working Well", req.file);
    
            if (req.file && req.file.buffer && req.file.mimetype.startsWith('image')) {
                next();
            } else{
                console.error('Invalid file format or missing file data LOL', err);
                return res.status(400).send('Invalid file format');
            }
        });
    }

// Home Page    
router.get('/', booksCtrl.index);
//Page to see the form to create a book
router.get('/new', isSignedIn, booksCtrl.new);
//Page to update the book
router.get('/edit/:id', booksCtrl.editPage);
router.get('/deletePage/:id',isSignedIn ,booksCtrl.deleteBookPage)
// Route to see all of your books
router.get('/yourBooks',isSignedIn, booksCtrl.viewYourBooks)
// Route to see all the action books only
router.get('/action',booksCtrl.actionBooks)
// Route to see all the fantasy books only 
router.get('/fantasy', booksCtrl.fantasyBooks)
// Route to see all the fiction books only
router.get('/fiction', booksCtrl.fictionBooks)
//Route to see all the horror books only
router.get('/horror', booksCtrl.horrorBooks)
// Route to see all the nonFiction books only
router.get('/non-fiction', booksCtrl.nonFictionBooks)
// Route to see all the sci-fi books only
router.get('/sci-fi', booksCtrl.sci_fiBooks)
// Route used to show a book
router.get('/:id', booksCtrl.show);
// Route used for creating a book 
router.post('/', isSignedIn,booksCtrl.uploadUserPhoto0, booksCtrl.resizeUserPhoto,  booksCtrl.create);
// Route used for updating a book
router.post('/:id/update',isSignedIn,uploadUserPhoto1,booksCtrl.resizeUserPhoto,booksCtrl.updateBook);
// Route used for deleting a book 
router.delete('/:id/delete',isSignedIn, booksCtrl.deleteBook)

module.exports = router;