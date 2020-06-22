const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    senderID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        required: true
    },
    recieverID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("notification",notificationSchema);