const Student=require('../models/student')
const Session = require('../models/session');
const bcrypt = require("bcrypt")
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require('jsonwebtoken')
require("dotenv").config();



module.exports.signup=async(req,res)=>{
    const body=req.body
    try{
        const isnewemail=await Student.isThisIDUsed(body.email)
        if(!isnewemail ){
            return res.json({
                message:"Already a member"
            })
        }
        else{
            const salt = genSaltSync(10);
            body.password = hashSync(body.password, salt);
            const new_student= new Student({
                email: body.email,
                firstName:body.firstName,
                lastName:body.lastName,
                password:body.password,
                level:body.level,
                progress:{},
                posts:[],
            })
            new_student.save()
            .then(response => {
                if(response.email)
                res.status(200).json({
                    message: "Sign up is successful"
                })
                else
                res.json({
                    message:"Some error occured"
                })
            })
        }
    }
    catch(error){
        console.log(error.message)
        res.json({
            message:"Some error occured"
        })
    }
}
module.exports.login=async (req,res)=>{
try {
    const body=req.body

    const std=await Student.findOne({email:body.email})
    if(std===null){
        return res.json({
            message:"Invalid Email or password"
        })
    }
    const sess = await Session.findOne({ email: body.email })
        if (sess !== null) {
          if (sess.session_number !== session_number) {
            return res.json({
              message: 'This Device is not recognized!'
            })
          }
        }
        
    const firstlogin = await Student.isThisIDUsed(data.data.email);
    
} catch (error) {
    
}
   

}