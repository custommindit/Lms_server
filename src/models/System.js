const mongoose = require('mongoose')
const Schema = mongoose.Schema

const systemSchema = new Schema({
    login_identifier: {
        type: Boolean
    },
    buy_now: {
        type: Boolean
    },
}, { timestamps: true })

const System = mongoose.model('system', systemSchema)
module.exports = System