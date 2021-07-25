const mongoose = require('mongoose');

const { Schema } = mongoose;

function toLower(v) {
  return v.toLowerCase();
}

const UserSchema = new Schema({
  email: { type: String, set: toLower },
});

const User = mongoose.model('User', UserSchema);
const user = new User({ email: 'AVENUE@Q.COM' });

console.log(user.email); // 'avenue@q.com'
