const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  loginToken: { type: String, select: false },
  password: { type: String, select: false }
}, { timestamps: true });

mongoose.connection.collection("devices").createIndex({ loginToken: 1 })

module.exports = mongoose.model('User', UserSchema);
