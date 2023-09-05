const mongoose = require('mongoose')
const Schema = mongoose.Schema

const examSchema = new Schema({
    name : {
        type: String,
        required:true
    },
    questions:[ {
        Q:String,
        choices:[String],
    }],
    answers:[Number],
    time: {
        type: Number,//in minuits
        required:true
    },
    unit: {
        type: String,
        required:true
        ///unit_id
    },
    level: {
        type: Number,
        required:true
    },


}, { timestamps: true })




const Exam = mongoose.model('Exam', examSchema)
module.exports = Exam