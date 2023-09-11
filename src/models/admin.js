const mongoose = require('mongoose')
const Schema = mongoose.Schema

const adminSchema = new Schema({
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
    phone:String,
    password: {
        type: String,
        required:true}

}, { timestamps: true })


adminSchema.statics.isThisIDUsed = async function (email) {
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

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin