const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
  userName: String,
  userAvatar: String,
    comment: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets the default value to the current date and time
    }
})

const bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    coverImage: {
         type: String,
      },
      user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      username:{
        type: Schema.Types.ObjectId,
        ref: 'Username'
      },
      userName: String,
      userAvatar: String,
    price: Number,
    ISBN: String,
    year: Number,
    description: String,
    comments: [commentSchema],
    genre:{
        type: String,
        enum: ['fantasy', 'sci-fi', 'horror', 'action', 'non-fiction', 'fiction']
    }
})

const Book = mongoose.model('Book', bookSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = {
    Book,
    Comment
}
