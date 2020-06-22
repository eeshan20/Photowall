const mongoose= require("mongoose");

const Schema= mongoose.Schema;

const cloudSchema= new Schema({
        image: {
            type: Buffer,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        date: {
            type: String,
            require: true
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
});

module.exports= mongoose.model("cloud",cloudSchema);