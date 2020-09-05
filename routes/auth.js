const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const crypto=require('crypto')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requirelogin = require("../middleware/requirelogin");
const { route }=require("./post");
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')
const {EMAIL,SENDGRID_API} = require("../config/keys")
var options = {
  auth: {
    api_key:SENDGRID_API
  }
}
const transporter=nodemailer.createTransport(sendgridTransport(options))
router.post("/signup", (req, res) => {
  const { name, email, password,pic } = req.body;
  if (!email || !password || !name)
    return res.status(422).json({ error: "failed please enter everthing" });
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User alredy exists" });
      }
      bcrypt.hash(password, 12).then((hasdedpassword) => {
        const user = new User({
          email,
          password: hasdedpassword,
          name,
          pic
        });
        user
          .save()
          .then((user) => {
            transporter.sendMail({
              to:user.email,
              from:"no.reply.mywebapp@gmail.com",
              subject:"signup success",
              html:"<h1>Welcome to my app</h1>"
            })
            res.json({ message: "saved successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email||!password) res.status(422).json({ error: "enter email or password" });
  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res
          .status(422)
          .json({ error: "Email not found or password does not match" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((domatch) => {
          if (domatch) {
            // res.json({message:"successfully logined"});
            transporter.sendMail({
              to:savedUser.email,
              from:"no.reply.mywebapp@gmail.com",
              subject:"Login alert",
              html:"<h1>You just logined to my app</h1>"
            })
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            const {_id,name,email,followers,following,pic}=savedUser
            res.json({ token ,user:{_id,name,email,followers,following,pic}});
          } else
            return res
              .status(422)
              .json({ error: "Email not found or password does not match" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
});
router.post('/resetpassword',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err)
    {
      console.log(err)
    }
    const token=buffer.toString("hex")
    User.findOne({email:req.body.email}).then(user=>{
      if(!user){
        return res.status(422).json({error:"User does not exist"})
      }
      user.resettoken=token
      user.expiretoken=Date.now()+600000
      user.save().then((result)=>{
        transporter.sendMail({
          to:user.email,
          from:"no.reply.mywebapp@gmail.com",
          subject:"reset password",
          html:`
          <p>You have requested for password reset</p>
          <h5>click<a href="${EMAIL}/reset/${token}">here</a>to reset password</h5>
          `
        })
        res.json({message:"check your email for reset link"})
      })
    })
  })
})
router.post("/newpassword",(req,res)=>{
  const newpassword=req.body.password;
  const sendtoken=req.body.token;
  User.findOne({resettoken:sendtoken,expiretoken:{$gt:Date.now()}}).then(user=>{
    if(!user)
    {
      return res.status(422).json({error:"Session expired"})
    }
    bcrypt.hash(newpassword,12).then(hasdedpassword=>{
      user.password=hasdedpassword;
      user.resettoken=undefined;
      user.expiretoken=undefined;
      user.save().then(saveduser=>{
        res.json({message:"password updated successfully"})
        transporter.sendMail({
          to:user.email,
          from:"no.reply.mywebapp@gmail.com",
          subject:"Successfully updated",
          html:"<p>Password has been reseted</p>"
        })
      })
    })
  }).catch(err=>{
    console.log(err)
  })
})
module.exports = router;
