const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: false
    },
    website: {
        type: String,
        default: '',
        required: false
    },
    bio: {
        type: String,
        default: '',
        required: false
    },
    image: {
        type: Buffer,
        default: '',
        required: false
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
})

module.exports= mongoose.model("userProfile",profileSchema);