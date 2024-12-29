//Require the necessary modules
const {Comment} = require('../models/book')
const {Book} = require('../models/book')
const User = require('../models/user')
const bookCtrl = require('../controllers/books')

//Export the functions
module.exports = {
    readComments,
    createComments,
    checkCommentOwnership,
    updateComments,
    showUpdatedComments
}

// alowing the ability to read comments
async function readComments(req, res) {
    try {
        let comment = await Comment.find({});
        if (!comment) {
            // Handle the case where the comment with the given ID is not found
            return res.status(404).send('Comment not found');
        }

        // Call bookCtrl.show and pass the response object and the comment data
        bookCtrl.show(res, comment);
        console.log("comments posted");
    } catch (err) {
        console.error("It's your read comments", err);
        console.log("It's your read comments function");
        // Handle other errors (e.g., database error) and send an appropriate response
        res.status(500).send('Internal Server Error');
    }
}
 
// alowing the ability to create comments
async function createComments(req, res) {
    try {
        const bookId = req.params.id;
        const commentData = {
            user: req.user._id,
            userName: req.user.name,
            userAvatar: req.user.avatar,
            comment: req.body.comments
        };

        const book = await Book.findById(bookId);

        if (!book) {
            // Handle case where the book is not found
            console.error('Book not found');
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        book.comments.push(commentData);
        await book.save();

        res.redirect(`/books/${bookId}`);
    } catch (err) {
        console.error('Error in createComments:', err);
    }
}

// alowing the ability to check comment ownership
async function checkCommentOwnership(req, res, next){
    try{
        const comment = await Comment.findById(req.params.id)
        if(!comment){
            console.log("User comment not found")
        }
        if(comment.user.id.toString() !== req.user.id){
            return res.status(403).json({ message: 'You are not authorized to edit this comment' });
        }
         // Pass control to the next middleware or route handler
    next();
    console.log("authentication passed")
    }catch(err){
        console.error(err)
        console.log("authentication failed")
    }
}

// alowing the ability to update comments
async function updateComments(req, res) {
    try {
        const bookId = req.params.id;
        const commentId = req.params.commentId;
        const updatedCommentText = req.body.comments;

        // Find the book that contains the comment
        const book = await Book.findById(bookId);

        if (!book) {
            console.error('Book not found');
            return res.status(404).json({ error: 'Book not found' });
        }

        // Find the specific comment within the book
        const comment = book.comments.id(commentId);

        if (!comment) {
            console.error('Comment not found');
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check comment ownership
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to edit this comment' });
        }

        // Update the comment text
        comment.comment = updatedCommentText;

        // Save the updated book
        await book.save();
        console.log('Comment update completed');
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
        console.error('Error in updateComments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// alowing the ability to show updated comments
async function showUpdatedComments(req, res){
    try{
        const bookId = req.params.id
        const commentId = req.params.commentId

        if (!book) {
            console.error('Book not found');
            return res.status(404).json({ error: 'Book not found' });
        }

        // Find the specific comment within the book
        const comment = book.comments.id(commentId);

        if (!comment) {
            console.error('Comment not found');
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check comment ownership
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to edit this comment' });
        }

        const book = await Book.findById(commentId)
        res.render('books/edit', {title: "Change_Comment", book, comment})
    }catch(err){
        console.error(err)
        console.log("It's your update comments function")
    }
}