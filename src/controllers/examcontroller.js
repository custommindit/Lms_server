
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