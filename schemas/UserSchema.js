const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
const GenderTyEnum=require('../domain/enumerations/GenderTypeEnum')

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
  gender:{
    type: Number,
    enum: [
      GenderTyEnum.Male,
      GenderTyEnum.Female,
      GenderTyEnum.Others
    ],
    default: GenderTyEnum.Female,
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
