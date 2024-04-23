const mongoose = require("mongoose")

const puzzleSchema = mongoose.Schema({
    puzzle: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    Time: {
        type: Number,
        required: true,
    },
})

const Puzzle = mongoose.model("Puzzle", puzzleSchema)

module.exports = Puzzle;