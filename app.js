const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const CoreData = require('./CoreData');
const EmployeeData = require('./EmployeeData');
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/UserDB');
var app =new express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

//----------GET-ENTRIES-FROM-DB----------//
app.get("/get",(req,res)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  CoreData.find()
  .then((details)=>{
    res.send(details);
  })
})

//----------GET-COUNT-FROM-EMPDB----------//
app.get("/empcount",(req,res)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  EmployeeData.collection.count()
  .then(counter=>{
    res.send(counter.toString());
  })
})

//----------GET-ENTRIES-FROM-DB----------//
app.get("/getallemps",(req,res)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  EmployeeData.find()
  .then((details)=>{
    res.send(details);
  })
})

//----------ADD-ENTRY-FOR-USER----------//
app.post("/register", (req,res)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  var userData = {
    uId: req.body.uId,
    date: req.body.date,
    time: req.body.time,
    vehicle: req.body.vehicle,
    jobMode: req.body.jobMode,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    address1: req.body.address1,
    address2: req.body.address2,
    email: req.body.email,
    pickAndDrop: req.body.pickAndDrop,
    isViewed: false,
    isAssigned: false,
    assignedEmp: null,
    isCompleted: false,
    payMode: null,
    amount: null
  }
  var userData = new CoreData(userData);
  userData.save();
})

//----------ADD-EMPLOYEE-FOR-ADMIN----------//
app.post("/addemp", (req,res) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  var empData = {
    empId: req.body.empId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobile: req.body.mobile,
    email: req.body.email,
    address1: req.body.address1,
    address2: req.body.address2,
    vehMode: req.body.vehMode,
    userName: req.body.userName,
    password: req.body.password
  }
  var empData = EmployeeData(empData);
  empData.save();
})

//----------PORT-INITIALIZATION----------//
app.listen(3000, function(){
  console.log("Listening to port 3000")
});
