const mongoose = require('mongoose')
const Schema = mongoose.Schema

const materialSchema = new Schema({
    name : {
        type: String,
        required:true
    },
    description: {
        type: String
    },link:{type: String,
        required:true},
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




const Material = mongoose.model('Material', materialSchema)
module.exports = Material