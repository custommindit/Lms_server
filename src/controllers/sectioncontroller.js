const {unit_exists,add_time,removequizSTD,removesectionSTD}=require('./misc')
const Section=require('../models/section')
const Quiz = require('../models/quiz')
const Grade = require('../models/grade')

module.exports.create=async(req,res)=>{
    try {
        let body=req.body
        const unite=await unit_exists(body.unit)
        if(unite===null){
            return res.json({Success:false,message:"Unit doesn't exist"})
        }
        const new_section=new Section({
            name:body.name,
            description:body.description,
            time:body.time,
            video:body.video,
            unit:body.unit,
            level:unite.level
        })
        new_section.save().then(async(response)=>{
            
            if(response){
                await add_time(body.unit,response.time)
                return res.json({Success:true,message:`Section ( ${response.name} ) Created`,
                    data:response
            })
            }
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.getone=async(req,res)=>{
    try {
        let id=req.params.id
        Section.findById(id).then(response=>{
            return res.json({Success:true,data:response})
        })
        
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.updateone=async(req,res)=>{
    try {
        let id=req.params.id
        Section.findByIdAndUpdate(id,{$set:{
            description:req.body.description
            ,video:req.body.video
            ,name:req.body.name
        }}).then(async(response)=>{
            await Quiz.updateMany({section:req.params.id},{name:req.body.name})
            return res.json({Success:true,data:response})
        })
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}

module.exports.deleteone=async(req,res)=>{
    try {
        if(!req.body.decoded.admin){
            return res.json({Success:true,message:"INVALID auth"})
        }
        else{
        let id=req.params.id
        const deleted=await Section.findById(id)
        const quizArr = await Quiz.find({ section: deleted._id });
        await add_time(deleted.unit,0-deleted.time)
        await removesectionSTD(id)
        const deletePromises = quizArr.map(async (quiz) => {
            await removequizSTD(quiz._id)
            await add_time(deleted.unit, 0 - quiz.time);
            await Quiz.findByIdAndDelete(quiz._id);
            await Grade.deleteMany({ quiz_id: quiz._id });
        });
        await Promise.all(deletePromises);
        await Section.deleteOne({_id:deleted._id})
        return res.json({Success:true,message:"Section and its linked quizes deleted"})}
    } catch (error) {
        console.log(error.message)
        return res.json({Success:false,message:"SOME ERROR OCCURED"})
    }
}