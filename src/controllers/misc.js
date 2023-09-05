const Unit=require('../models/unit')

module.exports.unit_exists=async (id)=>{
    const unit= await Unit.findById(id)
    return unit
}

module.exports.add_time=async (id,time)=>{
    const unit= await Unit.findByIdAndUpdate(id,{$inc:{totaltime:time,elementcount:1}})
    return unit
}