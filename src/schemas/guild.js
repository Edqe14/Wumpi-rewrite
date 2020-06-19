const mongoose = require('mongoose');

module.exports = mongoose.model('guildSettings', new mongoose.Schema({
    id: String,
    name: String,
    mutes: Map,
    variables: {
        prefix: String,
        timezone: String,
        supportRoleID: String,
        ticketGreetingMessage: String,
        ticketMaxTicketCount: Number,
        filtered_words: Array
    },
    values: {
        isAutoSlowdownEnabled: Boolean,
        isAutoModEnabled: Boolean,
        isAntiBotEnabled: Boolean,
        isBackUpEnabled: Boolean,
        isActionLogEnabled: Boolean,
        isMusicEnabled: Boolean,
        isInviteTrackerEnabled: Boolean,
        isSupportTicketsEnabled: Boolean
    },
    channels: {
        overwrites: Map,
        maintenanceCategoryID: String,
        ticketCategoryID: String,
        ticketLogChannelID: String,
        welcomeChannelID: String,
        imageOnlyChannelIDs: Array,
        botOnlyChannelIDs: Array,
        userOnlyChannelIDs: Array
    }
}));