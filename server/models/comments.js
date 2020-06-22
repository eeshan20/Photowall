const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    body: {
        type: String,
        required: true
    },
    postID: {
        type: Schema.Types.ObjectId,
        ref: "posts",
        required: true        
    },
    commentedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comments", commentSchema);