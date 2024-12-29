// Description: This file contains the logic for user registration and login.

// Import the User model
const User = require('../models/user').User
// Import the bcrypt package
const bcrypt = require('bcrypt')
// Import the passport package
const passport = require('passport')

// Export the functions
module.exports ={
    registration,
    registrationPage,
    loginPage,
    login
}

// Create and save a new user
async function registration(req, res, next) {
    try {  
      const { password, passwordConfirm } = req.body;

      // Check if the password inputted matches with the password
      if (password !== passwordConfirm) {
          return res.status(400).json({ error: 'Passwords do not match' });
      }

      if (!passwordConfirm) {
          return res.status(400).json({ error: 'Please confirm your password' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });
  
      // Save the user to the database
      await newUser.save();
      console.log("User Saved:", newUser);
  
      // Generate Token
      // const token = await newUser.generateAuthToken();
      console.log('User Created');
      res.redirect('/login')
    } catch (err) {
      console.log("It didn't save");
      console.error("registration err:", err);
      res.redirect('/register')
    }
  }
  
// Render the registration page
async function registrationPage(req, res){
    try{
        res.render('register.ejs')
    }catch(err){
        console .error("Page Error:",err)
    }
}

// Render the login page
async function loginPage(req, res){
    try{
        res.render('login.ejs')
        console.log("Were in The Login page!")
    }catch(err){
        console.error("Login Page Err:", err)
    }
}

// Login the user
async function login(req, res,next){
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if (!user) {
          return res.status(401).json({ error: 'Invalid username' });
      }

      console.log("Retrieved user from database:", user);
      console.log("Entered password:", password);
      console.log("Stored hashed password:", user.password);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
      console.log("isPasswordMatch:", isPasswordMatch);


      if (!isPasswordMatch) {
          return res.status(401).json({ error: 'Invalid password' });
      }
          // const token = await user.generateAuthToken();
          // if (req.headers.accept.includes('json')) {
          //   console.log('Sending JSON response with token');
          //   res.json({ token });
          // }else{
          //   console.log("No Data")
          // }
          console.log("Logged In")
          // res.redirect('/')
          next()
        }catch(err){
        console.error('Login Error:', err)
        console.log("We have a promblem")
    }
}