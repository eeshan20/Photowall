const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    likeCount: {
        type: Number,
        required: false,
        default: 0
    },
    commentCount: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("posts", postSchema);