const {unit_exists,add_time}=require('./misc')
const Exam=require('../models/exam')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({message:"Unit doesn't exist"})
        }
        if(body.questions.length!==body.answers.length)
        {
            return res.json({message:"questions and answers do not match"})
        }
        const new_exam=new Exam({
            name:unite.name,
            questions:body.questions,
            answers:body.answers,
            time:body.time,
            unit:body.unit,
            level:unite.level,
            start_time:body.start_time,
            end_time:body.end_time,
        })
        new_exam.save().then(async(response)=>{
            
            if(response){
                return res.json({message:`exam ( ${response.name} ) Created`,
                    data:response
            })
            }
            else
            return res.json({message:"Creation Failed"})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({message:"SOME ERROR OCCURED"})
    }
}