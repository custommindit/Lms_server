const Unit=require('../models/unit')
const Quiz=require('../models/quiz')
const Section=require('../models/section')
const Student=require('../models/student')
const Material=require('../models/material')
const Grade = require('../models/grade')

module.exports.unit_exists=async (id)=>{
    const unit= await Unit.findById(id)
    return unit
}
module.exports.section_exists=async (id)=>{
    const section= await Section.findById(id)
    return section
}

module.exports.add_time=async (id,time)=>{
    const count=time>0?1:-1
    const unit= await Unit.findByIdAndUpdate(id,{$inc:{totaltime:time,elementcount:count}})
    return unit
}
module.exports.get_parts=async (id)=>{
    const quizez=await Quiz.find({unit:id})
    const sections=await Section.find({unit:id})
    const material=await Material.find({unit:id})
    return [quizez,sections,material]
}
module.exports.delete_parts=async (id)=>{
    try{
    const quizes =await Quiz.find({unit:id})
    quizes.forEach(async(quiz) => {
        Grade.deleteMany({quiz_id:quiz._id})
        await quiz.deleteOne({_id:quiz._id})
    });
    await Section.deleteMany({unit:id})
    await Material.deleteMany({unit:id})
    return true
}
catch(error){
    return false
}
}
module.exports.delete_std_unit=async (id)=>{
    try{
        await Student.updateMany({},{ $pull: { myunits: {unit:id} } })
        
        return true
    }
    catch(error){
        return false
    }
}

module.exports.buycount=async (id)=>{
    const counter=await Student.count({"myunits.unit":id})
    return counter
}

module.exports.get_quizes=async (id)=>{
    const quizez=await Quiz.find({unit:id})
    return quizez
}

module.exports.removematerialSTD=async (id)=>{
    Student.updateMany(
        {},
        {
          $pull: {
            'myunits.$[].material': id
          }
        })
}
module.exports.removequizSTD=async (id)=>{
    Student.updateMany(
        {},
        {
          $pull: {
            'myunits.$[].quiz': id
          }
        })
}
module.exports.removesectionSTD=async (id)=>{
    Student.updateMany(
        {},
        {
          $pull: {
            'myunits.$[].section': id
          }
        })
}
