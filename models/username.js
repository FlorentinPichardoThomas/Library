const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const validator = require('validator')
const bcrypt = require('bcrypt')


const usernameSchema = new mongoose.Schema({
username:{
    type: String,
    required: [true]
},
email: String,
password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    // required: [true, 'Please confirm your password'],
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
})

  const Username = mongoose.model('Username', usernameSchema);

module.exports = Username;