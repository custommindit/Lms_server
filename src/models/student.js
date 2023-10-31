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
    image:{type:String,
             default:""
    },
    phone:String,
    password: {
        type: String,
        required:true
    },
    level:Number,
    myunits:[
        {unit:String,sections:[String],quizes:[String],material:[String]}
    ],
    //posts:[String],
    google:Boolean

}, { timestamps: true })


studentSchema.statics.isThisIDUsed = async function (email) {
    if(!email) throw new Error('Invalid email')
    try{
        const std = await this.findOne({email})
        if(std) return true
        return false
    }catch (error){
        console.log('error inside isThisEmailUse method ', error.message)
        return true
    }
}

const Student = mongoose.model('Student', studentSchema)
module.exports = Student