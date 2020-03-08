const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CreatorSchema = new Schema({
    domain: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

CreatorSchema.index(
    { domain: 1, username: 1 },
    { unique: true }
);

module.exports = mongoose.model('creators', CreatorSchema)