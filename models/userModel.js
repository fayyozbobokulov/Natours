const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const slugify = require('slugify');

// Name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pls enter your name!'],
    trim: true,
    maxlength: [40, 'A user name must have at least 40 characters'],
    minlength: [3, 'A user name must be no less than 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Pls provide your email!'],
    unique: [true, 'Your email already exists'],
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Pls provide valid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Pls provide a password!'],
    maxlength: [40, 'A password must be at least 40 characters'],
    minlength: [8, 'A password must be no less than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Pls confrim your password!'],
    validate: {
      // This only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same!',
    },
    select: false,
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // console.log(this.password);
  this.passwrodConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  cadidatePassword,
  userPassword
) {
  return await bcrypt.compare(cadidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChagedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
