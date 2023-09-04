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
        if (student) return false
        return true
    } catch (error) {
        console.log('error establishing history', error.message)
        return false
    }
}
const session = mongoose.model('session', sessionSchema)
module.exports = session