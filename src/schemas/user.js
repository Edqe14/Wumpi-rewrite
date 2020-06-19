const mongoose = require("mongoose");

module.exports = mongoose.model("Users", mongoose.Schema({
    id: String,
    isBot: Boolean,
    user: {
        username: String,
        discriminator: String,
        id: String,
        createDate: Date,
    }
}));