const mongoose = require('mongoose')
const Schema = mongoose.Schema

const examgradeSchema = new Schema({
    student_email : {
        type: String,
        required:true
    },
    exam_id:{
        type: String,
        required:true
    },
    choices:[String],
    grade:{
        type:Number,
        required:true
    }


}, { timestamps: true })




const Examgrade = mongoose.model('Examgrade', examgradeSchema)
module.exports = Examgrade