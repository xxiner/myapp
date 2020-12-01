const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {collection: 'User'})
const User = mongoose.model('User', UserSchema)
module.exports = User