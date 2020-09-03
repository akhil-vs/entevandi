const mongoose = require('mongoose');
const { time } = require('console');
mongoose.connect('mongodb://localhost:27017/UserDB');
const Schema = mongoose.Schema;

// any changes require corresponding changes in admindash and userdash component
var userSchema = new Schema({
  uId: String,
  date: String,
  time: String,
  vehicle: String,
  jobMode: String,
  firstName: String,
  lastName: String,
  mobile: Number,
  address1: String,
  address2: String,
  email: String,
  pickAndDrop: Boolean,
  isViewed: Boolean,
  isAssigned: Boolean,
  assignedEmp: String,
  isCompleted: Boolean,
  payMode: String,
  amount: Number
})

var CoreData = mongoose.model('entry', userSchema);

module.exports = CoreData;
