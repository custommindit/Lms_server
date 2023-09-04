const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sectionSchema = new Schema({
    name : {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    time: {
        type: Number,//in minuits
        required:true
    },
    video: {
        type: String,
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




const Section = mongoose.model('Section', sectionSchema)
module.exports = Section