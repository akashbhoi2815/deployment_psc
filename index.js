const express = require('express');
const { authentication } = require('./Middleware/auth');
const { UserModel } = require('./Models/userModel');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const connection = require('./config/db');
require("dotenv").config()

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8500;

app.get("/",(req,res)=>{
    res.send("Hello form Back-end Api")
})

app.get("/about",(req,res)=>{
    res.send("about page")
})

app.post("/signup",async(req,res)=>{
    const {name,email,password} = req.body;
    
    const user_email = await UserModel.findOne({email});
 
     if(user_email){
         res.send({"msg":"User is already exist, please try to login"});
     }
   else{
        
     bcrypt.hash(password, 3,async function(err, hash) {
         if(err){
           res.send({"msg":"Something went wrong"})
          }
           const new_user = new UserModel({
             email:email,
             password:hash,
             name:name
              })
              try {
                 await new_user.save();
                 res.send({"msg":"sign up successfull"})
               } catch (error) {
                 res.send({"msg":"Something Went Wrong"})
               }
         });
        
   }
   
 
 })


 app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    const hashed_pass = user.password;
    const user_id = user._id;
    bcrypt.compare(password, hashed_pass, function(err, result) {
        if(err){
            res.send({"msg":"something went wrong, try again later"});
        }
        if(result){
            var token = jwt.sign({user_id}, process.env.SECRET_KEY);
            res.send({msg:"Login Successfull",token})
        }else{
            res.send({"msg":"Login failed"})
        }
    });
})


app.get("/profile",authentication,async(req,res)=>{

    const {user_id}=req.body;
    const user = await UserModel.findOne({_id:user_id});
    const {name,email} = user;
    res.send({name,email})
})


app.listen(PORT,async()=>{
    try {
        await connection
        console.log("connected")
    } catch (error) {
        console.log("Something went wrong");
        console.log('error: ', error);
    }
    console.log(`listening on PORT ${PORT}`);
})