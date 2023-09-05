const mongoose = require('mongoose')
const Schema = mongoose.Schema

const unitSchema = new Schema({
    name : {
        type: String,
        required:true
    },
    level:Number,
    price: {
        type: Number,
        required:true
    },
    totaltime: {
        type: Number,
        required:true
    },
    elementcount:Number,
    image: {
        type: String,
        required:true
    },

}, { timestamps: true })




const Unit = mongoose.model('Unit', unitSchema)
module.exports = Unit