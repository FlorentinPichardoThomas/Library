// Purpose: This file is used to connect to the database using mongoose.

// Import the mongoose package
const mongoose = require('mongoose')
// Import the dotenv package
var dotenv = require('dotenv')
// Load the environment variables from the .env file
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Create a variable to store the connection
const db = mongoose.connection
// Connect to the database
db.on('connected', function(){
    console.log(`Connected to ${db.name} at ${db.host}:${db.port}`)
})