const mongoose = require('mongoose')
const Schema = mongoose.Schema

const studentSchema = new Schema({
    email: {
        type: String,
        required:true
    },
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    level:Number,
    myunits:[
        {unit:String,progress:[String]}
    ],
    posts:[String],

}, { timestamps: true })


studentSchema.statics.isThisIDUsed = async function (email) {
    if(!email) throw new Error('Invalid email')
    try{
        const std = await this.findOne({email})
        if(std) return false
        return true
    }catch (error){
        console.log('error inside isThisEmailUse method ', error.message)
        return false
    }
}

const Student = mongoose.model('Student', studentSchema)
module.exports = Student