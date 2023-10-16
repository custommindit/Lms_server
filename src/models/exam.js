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
    answers:[String],
    time: {
        type: Number,//in minuits
        required:true
    },
    start_time:{
        type:Date,
        required:true
    },
    end_time:{ 
        type:Date,
        required:true
    },
    level: {
        type: Number,
        required:true
    },
    showgrade:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })




const Exam = mongoose.model('Exam', examSchema)
module.exports = Exam