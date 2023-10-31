const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sessionSchema = new Schema({
    email:  String,
    session_number: String,
}, { timestamps: true })

sessionSchema.statics.isThisIDUsed = async function (email) {
    if (!email) throw new Error('Invalid id')
    try {
        const student = await this.findOne({ email: email })
        if (student) return true
        return false
    } catch (error) {
        console.log('error establishing history', error.message)
        return true
    }
}
const session = mongoose.model('session', sessionSchema)
module.exports = session