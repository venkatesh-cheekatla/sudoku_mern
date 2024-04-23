const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    Score: {
        type: Number,
        required: true,
        default: 0,
    },
    Games: {
        type: Number,
        required: true,
        default: 0,
    },
})

const User = mongoose.model("User", userSchema)

module.exports = User;