const mongoose = require("mongoose");

module.exports = mongoose.model("Users", mongoose.Schema({
    id: String,
    isBot: Boolean,
    isFlagged: Boolean,
    violation: Array,
    user: {
        username: String,
        discriminator: String,
        id: String,
        createDate: Date,
    }
}));