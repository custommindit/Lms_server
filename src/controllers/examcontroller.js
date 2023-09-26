const Examgrade = require("../models/examgrade");
const Exam=require('../models/exam')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        
        if(body.questions.length!==body.answers.length)
        {
            return res.json({Success:false,message:"questions and answers do not match"})
        }
        const start_time=new Date(body.start_time.year,body.start_time.month-1,body.start_time.day,body.start_time.hour)
        const end_time=new Date(body.end_time.year,body.end_time.month-1,body.end_time.day,body.end_time.hour)
        const new_exam=new Exam({
            name:body.name,
            questions:body.questions,
            answers:body.answers,
            time:body.time,
            level:body.level,
            start_time:start_time,
            end_time:end_time,
        })
        new_exam.save().then(async(response)=>{
            
            if(response){
                return res.json({Success:true,message:`exam ( ${response.name} ) Created`,
                    data:response
            })
            }
            else
            return res.json({Success:false,message:"Creation Failed"})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.getall = async (req, res) => {
    try {
      Exam.find().then((response) => {
        return res.json({ Success: true, data: response });
      });
    } catch (error) {
      console.log(error.message);
      return res.json({ Success: false, message: "SOME ERROR OCCURED" });
    }
  };

  module.exports.by_level=async(req,res)=>{
    try {

        Exam.find({level:req.params.level}).then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.by_my_level=async(req,res)=>{
    try {
        Exam.find({level:req.body.decoded.level}).then(async(response)=>{
                return res.json({Success:true,
                    response
            })
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.finish = async (req, res) => {
    try {
      const body = req.body;
      const G = await Examgrade.findOne({
        exam_id: body.id,
        student_email: body.decoded.email,
      });
      if (G === null) {

        const E= await Exam.findById(body.id)
        let count = 0;
        
        for (let i = 0; i < body.choices.length; i++) {
          if (body.choices[i] === E.answers[i]) {
            count++;
          }
        }
        var new_grade=new Examgrade({
            student_email :body.decoded.email,
            exam_id:body.id,
            choices:body.choices,
            grade:count
        })
        new_grade.save()
          .then((response) => {
            return res.json({ Success: true, message: "Exam graded ",response });
          })
      } else {

        return res.json({
            Success: false,
            message: "You have not started this quiz???",
          });
        
      }
    } catch (error) {
      console.log(error)
      return res.json({ Success: false, message: "SOME ERROR OCCURRED" });
    }
  };

  module.exports.deleteone=async(req,res)=>{
    try {
      if(req.body.decoded.admin)
        Exam.find({id:req.params.id}).then(async(response)=>{
              await Examgrade.deleteMany({exam_id:req.params.id})
              await Exam.deleteOne({_id:req.params.id})
              return res.json({Success:true,message:"Exam deleted"})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}