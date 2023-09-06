const Unit=require('../models/unit')
const Quiz=require('../models/quiz')
const Section=require('../models/section')

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
    const combinedData = [...quizez, ...sections];
    combinedData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return combinedData
}