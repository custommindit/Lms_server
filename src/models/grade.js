const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gradeSchema = new Schema({
    student_email : {
        type: String,
        required:true
    },
    quiz_id:{
        type: String,
        required:true
    },
    grade:{
        type:Number,
        required:true
    }


}, { timestamps: true })




const Grade = mongoose.model('Grade', gradeSchema)
module.exports = Grade