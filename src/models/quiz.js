const mongoose = require('mongoose')
const Schema = mongoose.Schema

const quizSchema = new Schema({
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
    unit: {
        type: String,
        required:true
        ///unit_id
    },
    section: {
        type: String,
        required:true
        ///unit_id
    },
    level: {
        type: Number,
        required:true
    },
    grading: {
        type: Boolean,
        required:true
    },



}, { timestamps: true })




const Quiz = mongoose.model('Quiz', quizSchema)
module.exports = Quiz