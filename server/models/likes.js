const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true
    },
    likedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("likes", likeSchema);