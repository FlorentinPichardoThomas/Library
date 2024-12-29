const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema

// Local user schema
const localUserSchema = new Schema({
    username: String,
    password: String
}, {
    timestamps: true
});

// OAuth user schema
const oauthUserSchema = new Schema({
    name: String,
    googleId: String,
    email: String,
    avatar: String
}, {
    timestamps: true
});

// Common user schema
const userSchema = new Schema({
    name: String,
    email: String,
    avatar: String,
    username: String,
    password: String,
    authType: String, // Discriminator key
}, {
    timestamps: true
});

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Method to verify password for local users
localUserSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Discriminator for local users
const LocalUser = mongoose.model('LocalUser', localUserSchema);

// Discriminator for OAuth users
const OAuthUser = LocalUser.discriminator('OAuthUser', oauthUserSchema);

const User = mongoose.model('User', userSchema)

// Export the models
module.exports = {
    LocalUser,
    OAuthUser,
    User
};
