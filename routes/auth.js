const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requirelogin = require("../middleware/requirelogin");
const { route }=require("./post");




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
            res.json({ message: "saved success" });
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

module.exports = router;
