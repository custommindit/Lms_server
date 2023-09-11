const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.signup = async (req, res) => {
  const body = req.body;
  try {
    const isnewemail = await Admin.isThisIDUsed(body.email);
    if (!isnewemail) {
      return res.json({
        Success:false,
        message: "Already a member",
      });
    } else {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const new_Admin = new Admin({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password
      });
      new_Admin.save().then((response) => {
        if (response.email)
          res.status(200).json({
            Success:true,
            message: "Sign up is successful",
          });
        else
          res.json({
            Success:false,
            message: "Some error occured",
          });
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "Some error occured",
    });
  }
};

module.exports.login = async (req, res) => {
    try {
      const body = req.body;
      const admin = await Admin.findOne({ email: body.email });
      if (admin === null) {
        return res.json({
          Success:false,
          message: "Invalid Email or password",
        });
      }
      
      bcrypt.compare(body.password, admin.password,async function (err, result) {
          if (err) {
            return res.json({
              Success:false,
              message: "server error",
            });
          }
          if (result) {
  
            
            let token = jwt.sign(
              { email: admin.email, name: admin.firstName,admin:true },
              process.env.JWT_KEY
            );
            
            admin.password = undefined;
            return res.json({
              Success:true,
              message: "Login Successful!",
              token: token,
              data: admin,
            });
          } else {
            return res.json({
              Success:false,
              message: "Invalid Email or password",
            });
          }
        });
    } catch (error) {
      console.log(error.message)
      return res.json({
        Success:false,
        message: "Server error",
      });
    }
  };