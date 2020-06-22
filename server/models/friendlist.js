const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendListSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    friendsID: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        }
    ]
});

module.exports = mongoose.model("friendList", friendListSchema);