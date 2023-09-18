const Unit=require('../models/unit')
const Quiz=require('../models/quiz')
const Section=require('../models/section')
const Student=require('../models/student')
const Material=require('../models/material')

module.exports.unit_exists=async (id)=>{
    const unit= await Unit.findById(id)
    return unit
}
module.exports.section_exists=async (id)=>{
    const section= await Section.findById(id)
    return section
}

module.exports.add_time=async (id,time)=>{
    const unit= await Unit.findByIdAndUpdate(id,{$inc:{totaltime:time,elementcount:1}})
    return unit
}
module.exports.get_parts=async (id)=>{
    const quizez=await Quiz.find({unit:id}).select('-answers')
    const sections=await Section.find({unit:id})
    const material=await Material.find({unit:id})
    return [quizez,sections,material]
}
module.exports.delete_parts=async (id)=>{
    try{
    await Quiz.deleteMany({unit:id})
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
        Student.updateMany(
            { 'myunits.unit': id },
            { $pull: { 'myunits': { unit: id } } }
        )
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
    const quizez=await Quiz.find({unit:id}).select('-answers')

    return quizez
}