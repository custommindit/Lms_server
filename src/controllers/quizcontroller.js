const {section_exists,add_time}=require('./misc')
const Quiz=require('../models/quiz')
const { response } = require('express')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const section=await section_exists(body.section)
        if(section===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
        if(body.questions.length!==body.answers.length)
        {
            return res.json({Success:false,message:"questions and answers do not match"})
        }
        const new_quiz=new Quiz({
            name:section.name,
            questions:body.questions,
            answers:body.answers,
            time:body.time,
            unit:section.unit,
            section:section._id,
            level:section.level,
            grading:body.grading,
            graded:[]
        })
        new_quiz.save().then(async(response)=>{
            
            if(response){
                await add_time(section.unit,response.time)
                return res.json({Success:true,message:`quiz ( ${response.name} ) Created`,
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
module.exports.start=async(req,res)=>{
    try {
        const body=req.body
        const Q=await Quiz.findOne({_id:body.id,graded:{student:body.decoded.email}})
        if(Q!==null){
            return res.json({Success:false,message:"You have already accessed this quiz"})
        }
        else{
            Quiz.findByIdAndUpdate(body.id,{$push:{graded:{
                student:body.decoded.email,
                grade:-1
            }}}).then(response=>{
                return res.json({Success:true,message:"Quiz timer started!!"})
            })
        }
    } catch (error) {
        console.log(error)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
module.exports.finish = async (req, res) => {
    try {
      const body = req.body;
      const Q = await Quiz.findOne({
        _id: body.id,
        "graded.student": body.decoded.email,
        "graded.grade": -1,
      });
      if (Q === null) {
        return res.json({ Success: false, message: "You have not started this quiz???" });
      } else {
        let count = 0;
  
        for (let i = 0; i < body.choices.length; i++) {
          if (body.choices[i] === Q.answers[i]) {
            count++;
          }
        }
        Quiz.updateOne(
          { _id: Q._id, "graded.student": body.decoded.email },
          { $set: { "graded.$.grade": count } }
        )
          .then((response) => {
            return res.json({ Success: true, message: "Quiz graded " });
          })
          .catch((error) => {
            return res.json({ Success: false, message: "Failed to update grade" });
          });
      }
    } catch (error) {
      return res.json({ Success: false, message: "SOME ERROR OCCURRED" });
    }
  };
  
  
  module.exports.getone=async(req,res)=>{
    try {
        let id=req.params.id
        Quiz.findById(id).then(response=>{
            return res.json({Success:true,data:response})
        })
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}
  
  
  