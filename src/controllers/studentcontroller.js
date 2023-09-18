const Student = require("../models/student");
const Session = require("../models/session");
const Unit = require("../models/unit");
const Grade = require("../models/grade");
const {unit_exists,get_parts,get_quizes}=require('./misc')
const bcrypt = require("bcrypt");
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.signup = async (req, res) => {
  const body = req.body;
  try {
    const isnewemail = await Student.isThisIDUsed(body.email);
    if (!isnewemail) {
      return res.json({
        Success:false,
        message: "Already a member",
      });
    } else {
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      const new_student = new Student({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        password: body.password,
        phone:body.phone,
        level: body.level,
        myunits: [],
       // posts: [],
      });
      new_student.save().then((response) => {
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
    var session_number = body.identifier;
    const std = await Student.findOne({ email: body.email });
    if (std === null) {
      return res.json({
        Success:false,
        message: "Invalid Email or password",
      });
    }
    const sess = await Session.findOne({ email: body.email });
    if (sess !== null) {
      if (sess.session_number !== session_number) {
        return res.json({
          Success:false,
          message: "This Device is not recognized!",
        });
      }
    }
    bcrypt.compare(body.password, std.password,async function (err, result) {
        if (err) {
          return res.json({
            Success:false,
            message: "server error",
          });
        }
        if (result) {

          if (sess === null) {
            let session = new Session({
              email: std.email,
              session_number: session_number
            })
            await session.save()
          }

          let token = jwt.sign(
            { email: std.email, name: std.firstName,session_number:session_number,level:std.level },
            process.env.JWT_KEY
          );
          
          std.password = undefined;
          return res.json({
            Success:true,
            message: "Login Successful!",
            token: token,
            data: std,
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


module.exports.getdata=async(req,res)=>{
  try {
    Student.findOne({email:req.body.decoded.email}).select("-password").then(std=>{
      return res.json({data:std,Success:true,message:"data fetched sucessfully"})
    })
  } catch (error) {
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}

module.exports.getall=async(req,res)=>{
  try {
    Student.find().select("firstName,lastName,email,_id").then(std=>{
      return res.json({data:std,Success:true,message:"data fetched sucessfully"})
    })
  } catch (error) {
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}

module.exports.buy_unit=async(req,res)=>{
  try {
    const body=req.body
    if(body.decoded.admin===true){
      const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
    Student.findOneAndUpdate({email:body.email},{ $push: { myunits: {unit:unite._id,
      sections:[],quizes:[],material:[]} } },{new:true}).then(std=>{
      return res.json({data:std,Success:true,message:"enrolled sucessfully"})
    })}
    else{
      return res.json({message:"Auth Failed",Success:false})
    }
  } catch (error) {
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}

module.exports.deleteunit=async(req,res)=>{
  try {
    const body=req.body
    if(body.decoded.admin===true){
      const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
    Student.findOneAndUpdate({email:body.email},{ $pull: { myunits: {unit:unite._id} } },{new:true}).then(std=>{
      return res.json({data:std,Success:true,message:"Deleted sucessfully"})
    })}
    else{
      return res.json({message:"Auth Failed",Success:false})
    }
  } catch (error) {
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}


module.exports.add_progress = async (req, res) => {
  try {
    const body = req.body;
    const unit = body.unit;
    const category = Object.keys(body.parts);
    const studentEmail = body.decoded.email;
    const student = await Student.findOne({ email: studentEmail });
    /*body=
    {unit:"_id",parts:{[section,material,quiz]:"_id"}}
    */
    if (!student) {
      return res.json({ message: 'Student not found', Success: false });
    }

    const myUnit = student.myunits.find((unitObj) => unitObj.unit === unit);

    if (!myUnit) {
      return res.json({ message: 'Unit not found', Success: false });
    }

    switch (category[0]) {
      case 'section':

        const uniqueSections = new Set(myUnit.sections);
        myUnit.sections.forEach((section) => uniqueSections.add(section));
        uniqueSections.add(body.parts.section)
        myUnit.sections = Array.from(uniqueSections);
        break;
      case 'quiz':
        const uniquequizes = new Set(myUnit.quizes);
        myUnit.quizes.forEach((quiz) => uniquequizes.add(quiz));
        uniquequizes.add(body.parts.quiz)
        myUnit.quizes = Array.from(uniquequizes);
        break;
      case 'material':

        const uniqueMaterial = new Set(myUnit.material);
        myUnit.material.forEach((item) => uniqueMaterial.add(item));
        uniqueMaterial.add(body.parts.material)
        myUnit.material = Array.from(uniqueMaterial);
        break;
      default:
        return res.json({ message: 'Invalid category', Success: false });
    }

    await student.save();

    return res.json({ message: 'Progress added successfully', Success: true });
  } catch (error) {
    console.error('Error in add_progress:', error);
    return res.json({ message: 'INTERNAL SERVER ERROR', Success: false });
  }
};
module.exports.getmyunitdata=async(req,res)=>{
  try {
    const myunits=await Student.findOne({email:req.body.decoded.email}).select("myunits")
    if(myunits.length<1){
     return res.json({message:"no units bought",Success:false})}
    else {
     var list=[]
    for (var i = 0; i < myunits.myunits.length; i++) {

      const [quizes,sections,material]=await get_parts(myunits.myunits[i].unit)
      const U=await Unit.findById(myunits.myunits[i].unit)
      const done=(myunits.myunits[i].sections.length+myunits.myunits[i].quizes.length+myunits.myunits[i].material.length)
      list.push({quizes:quizes,
        sections:sections,
        material:material,
        unit:U,
        done:done})
    }
    return res.json({
      Success:true,
      data:list
})}
  } catch (error) {
    console.log(error.message)
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}
module.exports.getmyquizdata=async(req,res)=>{
  try {
    const myunits=await Student.findOne({email:req.body.decoded.email}).select("myunits")
    if(myunits.length<1){
     return res.json({message:"no units bought",Success:false})}
    else {
     var list=[]
    for (var i = 0; i < myunits.myunits.length; i++) {

      const quizes=await get_quizes(myunits.myunits[i].unit)
      const completed=myunits.myunits[i].quizes
      const grades=await Grade.find({student_email:req.body.decoded.email,quiz_id:{$in:completed}})
      list.push({
        quizes:quizes,
        completed:completed,
        grades:grades
      })
    }
    return res.json({
      Success:true,
      data:list
})}
  } catch (error) {
    console.log(error.message)
      return res.json({message:"INTERNAL SERVER ERROR",Success:false})
  }
}