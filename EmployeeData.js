const mongoose = require('mongoose');
const { time } = require('console');
mongoose.connect('mongodb://localhost:27017/UserDB');
const Schema = mongoose.Schema;

var empSchema = new Schema({
  empId: Number,
  firstName: String,
  lastName: String,
  mobile: Number,
  address1: String,
  address2: String,
  email: String,
  vehMode: String,
  userName: String,
  password: String
})

var EmployeeData = mongoose.model('employee', empSchema);

module.exports = EmployeeData;
