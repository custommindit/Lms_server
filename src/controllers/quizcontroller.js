const {section_exists,add_time}=require('./misc')
const Quiz=require('../models/quiz')

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
            name:body.name,
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