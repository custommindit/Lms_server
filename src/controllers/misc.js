const Unit=require('../models/unit')

module.exports.unit_exists=async (id)=>{
    const unit= await Unit.findById(id)
    return unit
}