const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true},
  password: {
    type: String,
    required: true},
  adminSerct: {
    type:String,
    default:""},
  isAdmin:{
    type:Boolean,
    default:false},
  createTime: {
    type: Date,
    default: Date.now  
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
