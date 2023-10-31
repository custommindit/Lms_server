const Student = require("../models/student");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.login = async (req, res) => {
  try {
    const body = req.body;
    const studentexists = await Student.isThisIDUsed(body.email );
    const adminexists = await Admin.isThisIDUsed( body.email );
    if (!(studentexists || adminexists)) {
      return res.json({
        Success: false,
        message: "Invalid Email or password",
      });
    }
    let session_number, user, sess;
    if (studentexists) {
      user=await Student.findOne({email:body.email})
      session_number=body.identifier
      sess = await Session.findOne({ email: body.email });
      if (sess !== null) {
        if (sess.session_number !== session_number) {
          return res.json({
            Success: false,
            message: "This Device is not recognized!",
          });
        }
      }
    }
    else{
      user=await Admin.findOne({email:body.email})
    }
    bcrypt.compare(body.password, user.password, async function (err, result) {
      if (err) {
        return res.json({
          Success: false,
          message: "server error",
        });
      }
      if (result) {
        if(studentexists){if (sess === null) {
          let session = new Session({
            email: user.email,
            session_number: session_number,
          });
          await session.save();
        }}
        let tokenbody={}
        if(studentexists)
        tokenbody={
          email: user.email,
          name: user.firstName,
          session_number: session_number,
          level: user.level,
          admin:adminexists
        }
        else{
          tokenbody= { email: user.email, name: user.firstName,admin:true }
        }
        let token = jwt.sign(
          tokenbody,
          process.env.JWT_KEY
        );

        user.password = undefined;
        return res.json({
          Success: true,
          message: "Login Successful!",
          token: token,
          data: user,
          admin:adminexists
        });
      } else {
        return res.json({
          Success: false,
          message: "Invalid Email or password",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      Success: false,
      message: "Server erro",
    });
  }
};
module.exports.data = async (req, res) => {
  return(res.json({
          Success: true,
          message: "Success",
          data: req.body.decoded,
          admin:adminexists
  }))
};

