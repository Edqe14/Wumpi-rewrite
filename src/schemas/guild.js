const mongoose = require('mongoose');

module.exports = mongoose.model('guild', new mongoose.Schema({
    id: String,
    name: String,
    prefix: String,
    features: {
        support: {
            supportRole: String,
            ticketGreetingMessage: String,
            ticketMaxTicketCount: Number,
            ticketCategory: String,
            ticketLogChannel: String
        },
        moderation: {
            filteredWords: Array,
            whitelistDefaultWords: Array,
            useCustomFilter: Boolean,
            punishments: Array,
            history: Map
        },
        greeting: {
            welcomeChannel: String,
            welcomeMessage: String,
            goodbyeChannel: String,
            goodbyeMessage: String
        },
        maintenance: {
            maintenanceCategory: String,
            overwrites: Map
        },
        imageOnlyChannels: Array,
        textOnlyChannels: Array,
        disabled: Map
    },
    toggle: {
        backup: Boolean,
        channel: {
            imageOnly: Boolean,
            textOnly: Boolean
        },
        greeting: {
            goodbye: Boolean,
            welcome: Boolean
        },
        inviteTracker: Boolean,
        music: Boolean,
        moderation: {
            actionLogs: Boolean,
            autoSlowdown: Boolean,
            autoMod: Boolean,
            verification: Boolean
        },
        support: Boolean
    }
}));