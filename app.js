const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const CoreData = require('./CoreData');
const cors = require('cors');
mongoose.connect('mongodb://localhost:27017/UserDB');
var app =new express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.get("/get",(req,res)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH");
  CoreData.find()
  .then((details)=>{
    res.send(details);
  })
})

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

app.listen(3000, function(){
  console.log("Listening to port 3000")
});
