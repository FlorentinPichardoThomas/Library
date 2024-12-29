// requiring the models
const User = require('../models/user')
const Username = require('../models/username')
const {Book} = require('../models/book')
// importing multer to be used
const multer = require('multer')
// importing shard to resize the image
const sharp = require('sharp')
const fs = require('fs').promises; // Using fs.promises for async/await support
const mongoose = require('mongoose');

// Export the functions
module.exports = {
    index,
    new: newBook,
    show,
    create,
    updateBook,
    editPage,
    deleteBookPage,
    deleteBook,
    resizeUserPhoto,
    uploadUserPhoto0,
    actionBooks,
    sci_fiBooks,
    fantasyBooks,
    fictionBooks,
    nonFictionBooks,
    horrorBooks,
    viewYourBooks,
}

// Multer filter to check if the file is an image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  };

  // Multer storage configuration
const storage = multer.memoryStorage()
 
// Multer upload configuration
const upload = multer({
     storage: storage,
     fileFilter: multerFilter
    })

    // Middleware to upload the user photo
    function uploadUserPhoto0(req, res, next) {
        upload.single('coverImage')(req, res, function (err) {
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
    
    
// Index function to display all books
async function index(req, res){
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const books = await Book.find({}).find(searchOptions)
        res.render('books/index', { title: 'Zamazon', books, searchOptions: req.query})
        console.log("Book rendered properly")
    }catch(err){
        console.error("Error:", err)
        res.status(500).send("Internal Server Error Index Function")
        console.log("It's your index function")
    }
}

// New function to display the form to create a new book
async function newBook(req, res){
    try{
        res.render('books/new', { title: 'Make_Your_Book'})
        console.log("newBook worked")
    }catch(err){
        console.error("Error:", err)
        res.status(500).send("Internal Server Error In NewBook")
        console.log("It's your newBook")
    }
}

//Show function to display a single book
async function show(req, res) {
    try {
        let book;
        // const bookId = req.params.id;
        if (req.params.id === 'genre') {
            // Query books by genre
            book = await Book.find({ genre: req.params.genre });
        } else {
            // Query book by ID
            book = await Book.findById(req.params.id).populate('comments.user', 'name avatar');
        }
        if (!book) {
            console.error('Book not found:', book);
            return res.status(404).send('Book not found');
        }

        const currentUser = req.user;
        res.render('books/show', { title: 'About_Book', book, currentUser });
        console.log('Showing Right');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
        console.log("It's Not Showing Right");
    }
}

// Function to show action Books
async function actionBooks(req, res) {
    try {
        
        const searchGenres = { genre: 'action' };

      
        const books = await Book.find(searchGenres);

        res.render('books/action', { title: 'Action Books', books, searchOptions: req.query });
    } catch (err) {
        // Handle errors
        console.error('Error in actionBooks:', err);
    }
}

// Function to show sci-fi Books
async function sci_fiBooks(req, res){
    try{
        const genre = req.query.genre
        const books = await Book.find({}).find({genre: 'sci-fi'})
        res.render('books/sci-fi', {title: "Sci-fi Books", books, searchOptions: req.query })
    }catch(err){
        console.error('Error in sciBooks:', err);
    }
}

//  Function to show fantasy Books
async function fantasyBooks(req, res){
    try{
        const searchGenres = {genre: 'fantasy'}
        const books = await Book.find(searchGenres)
        res.render('books/fantasy', {title: "fantasy books", books, searchOptions: req.query})
    }catch(err){
        console.error("Error in FantasyBooks", err)
        res.render('error', { errorMessage: 'Error fetching Fantasy Books'})
    }
}

// Function to show horror Books
async function horrorBooks(req, res){
    try{
        const searchGenres = {genre: 'horror'}
        const books = await Book.find(searchGenres)
        res.render('books/horror', {title: 'Horror', books, searchOptions: req.query})
    }catch(err){
        console.error("Error in horror Books", err)
    }
}

// Function to show non-fiction Books
async function nonFictionBooks(req, res){
    try{
        const searchGenres = {genre: 'non-fiction'}
        const books = await Book.find(searchGenres)
        res.render('books/non-fiction', {title: 'Non-Fiction', books, searchOptions: req.query})
    }catch(err){
        console.error("Error in Non-Fiction Books", err)
    }
}


// Function to show fiction Books
async function fictionBooks(req, res){
    try{
        const searchGenres = {genre: 'fiction'}
        const books = await Book.find(searchGenres)
        res.render('books/fiction', {title: 'Fiction', books, searchOptions: req.query})
    }catch(err){
        console.error("Error in Fiction Books", err)
    }
}

// Create function to create a new book
async function create(req, res) {
    try {
        for (let key in req.body) {
            if (req.body[key] === '') delete req.body[key];
        }
    
        
        const { name, price, ISBN, year, description, comments, genre } = req.body;
        const user = req.user._id;
        const userName = req.user.name;
        const userAvatar = req.user.avatar;
        const {coverImage} = req.file;
        const book = new Book({ name, coverImage,user ,userName,userAvatar ,price, ISBN, year, description, comments, genre });
        req.file.coverImage = `book-${book._id}-${Date.now()}.jpeg`;
            await book.save();

            console.log("Book saved successfully.", book);

            res.redirect(`/books/${book._id}`);
    } catch (err) {
        console.error("Error:", err);
        console.log("It's your create function")
        if (err.name === 'ValidationError') {
            console.log("Validation Errors:", err.errors);
        }
        res.redirect('/books/new');
    }
}

// Resize the user photo
async function resizeUserPhoto(req, res, next) {
    try {
        if (!req.file) {
          console.log("No file to resize")
            return next()
        }

        const book = await Book.findOne({}).sort({ _id: -1 })
        if (!book) {
            console.error("Book not Found");
            return res.status(404).send("Book not found!");
        }
        console.log("Book ID:", book.coverImage);
        req.file.coverImage = `book-${book._id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
    .resize(50,50)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/images/books/${req.file.coverImage}`);

        console.log("Image resized and uploaded successfully.");
        next()
    } catch (err) {
        console.error("Error Resizing Image", err);
        return res.status(500).send("Error processing image");
    }
}

// Update the book
async function updateBook(req, res){
    try{
        const bookId = req.params.id
        console.log('Book ID:', bookId)

        if (!bookId) {
            console.error('Book ID is undefined.');
            return res.redirect('/');  // Redirect to the homepage or handle appropriately
        }

        const book = await Book.findById(bookId)
        console.log('Book:', book)

        book.name = req.body.name || book.name; // Keep existing name if not provided
        if (req.file && req.file.coverImage) {
            book.coverImage = req.file.coverImage || book.coverImage
        }
        book.user = req.user._id || book.user;
        book.userName = req.user.name || book.userName;
        book.userAvatar = req.user.avatar || book.userAvatar;
        book.price = req.body.price || book.price
        book.ISBN = req.body.ISBN || book.ISBN
        book.year = req.body.year || book.year
        book.description = req.body.description || book.description
        book.comments = req.body.comments || book.comments
        book.genre = req.body.genre || book.genre

        // Check if the book exists
        if (!book) {
            console.error("Book not found");
            return res.status(404).send("Book not found!");
        }

        for (let key in req.body) {
            if (req.body[key] !== '') {
                book[key] = req.body[key];
            }
        }

//Save the book
const updatedBook = await book.save()

console.log("Book updated successfully.", updatedBook);

// Redirect to the book details page
res.redirect(`/books/${updatedBook._id}`)

    }catch(err){
        console.error("Update Book Error:", err)
        res.redirect(`/books/${Book._id}/edit`)
    }
}
//Render the edit page
async function editPage(req, res){
    try{
const book = await Book.findById(req.params.id)
        res.render(`books/edit`, {title: "Change_Book", book})
    }catch(err){
        console.error("Edit Page Error:", err)
    }
}

//Delete the book
async function deleteBook(req, res){
    try{
    
    const book = await Book.findById(req.params.id)
    console.log('Found Book:', book);

    if (!book) {
        console.error("Book not found");
        return res.status(404).send("Book not found!");
    }

    for (let key in req.body) {
        if (req.body[key] !== '') {
            book[key] = req.body[key];
        }
    }

    await book.deleteOne()

    console.log("Book Deleted Sucessfully")

    res.redirect('/books')
    }catch(err){
        console.error("Delletion Error:",err)
        res.status(500).send('Internal Server Error')
    }
}

//Render the delete page
async function deleteBookPage(req, res){
    try{
        const book = await Book.findById(req.params.id)
        res.render('books/deletePage', {title: 'Delete_Page', book})
    }catch(err){
        console.error('Error Rendering Delete Page:', err)
    }
}

// View your books
async function viewYourBooks(req, res) {
    const person = {user: req.user._id}
    try {
        const books = await Book.find(person)
        res.render('books/yourBooks', {title: "Your_Books", books, searchOptions: req.query });
        console.log("User View Working")
    } catch (err) {
        console.error('Error in viewYourBooks:', err);
        res.status(500).send('Internal Server Error');
    }
}

