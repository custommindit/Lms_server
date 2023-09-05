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
            name:body.name,
            questions:body.questions,
            answers:body.answers,
            time:body.time,
            unit:body.unit,
            level:unite.level
        })
        new_exam.save().then(async(response)=>{
            
            if(response){
                await add_time(body.unit,response.time)
                return res.json({message:`Exam ( ${response.name} ) Created`,
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