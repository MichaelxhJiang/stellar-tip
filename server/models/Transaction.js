const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionSchema = new Schema({
    sender: {
        type: String,
    },
    receiver: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    isAnon: {
        type: Boolean,
    },
    transactionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('transactions', TransactionSchema)