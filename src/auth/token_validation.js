const jwt = require("jsonwebtoken");
const Session = require("../models/session");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);

      jwt.verify(token, process.env.JWT_KEY, async(err, decoded) => {
        if (err) {
          console.log(err);
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        } else {
          const  session=await Session.findOne({email:decoded.email,session_number:decoded.session_number})
          if(session===null&&decoded.admin!==true){
            return res.json({
              success: 0,
              message: "Invalid Session..."
            });
          }
          req.body.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};