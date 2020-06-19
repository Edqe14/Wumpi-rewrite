const mongoose = require("mongoose");

module.exports = exports = mongoose.model("Backup", mongoose.Schema({
    key: String,
    id: String,
    authorId: String,
    guild: {
        name: String,
        region: String,
        filter: Number,
        icon: String,
        afkChannel: {
            name: String,
            timeout: Number,
        },
        roles: Object,
        channels: Object
    }
}));