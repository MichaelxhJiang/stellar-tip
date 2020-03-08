const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
    sender: { //alias
        type: String,
    },
    receiver: { //username
        type: String,
        required: true
    },
    url: { //where you paid
        type: String,
        required: true
    },
    memoID: { //UID+payer8+payee8
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('transactions', TransactionSchema)