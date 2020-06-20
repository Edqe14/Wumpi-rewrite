const { Util: DiscordUtil, Client, Guild, Channel } = require('discord.js');
const { Document } = require('mongoose');
const { readdir } = require('fs');
const Server = require('./server.js');
const Collection = require('@discordjs/collection');
const Filter = require('bad-words');
const ms = require("ms");
const GuildSettings = require("../schemas/guild.js");

class Util extends DiscordUtil {
    /**
     * Initiate handlers
     * @param {Client} client Discord.js Client instance
     */
    static initiate(client) {
        if(!client || !(client instanceof Client)) throw new TypeError("Invalid client type");

        const config = client.config = require('../config.json');
        client.Util = Util;
        client.Server = new Server(client);
        client.Filter = new Filter();
        client.setMaxListeners(10000)

        const commands = client.commands = new Collection();
        readdir(__dirname+"/../handlers/commands/", (e, f) => {
            if(e) throw e;
            const js = f.filter(f => f.split('.').pop() === 'js');
        
            if(js.length <= 0) return console.log('No commands is available to load...');
            js.forEach((fi, i) => {
                const c = require(__dirname+`/../handlers/commands/${fi}`);
                
                console.log(`${i+1}: ${fi} loaded!`);
                commands.set(c.name, c);
            }); 
        });

        readdir(__dirname+"/../handlers/", (e, files) => {
            if (e) throw e;

            const handlers = files.filter(f => f.split(".").pop() === "js");
            if (handlers.length <= 0) return console.log("There are no handlers to load...");

            console.log(`Loading ${handlers.length} handlers...`);
            handlers.forEach((f, i) => {
                require(`../handlers/${f}`)(client, config);
                console.log(`${i + 1}: ${f} loaded!`);
            });
            client.setMaxListeners(10000);
        });
    };

    static sleep(ms) {
        return new Promise((res) => setTimeout(res, ms));
    }

    /**
     * Generate new guild data and save to DB
     * @param {Guild} g Discord.js Guild instance
     */
    static async newGuildData(g, config) {
        const newGuild = new GuildSettings({
            id: g.id,
            name: g.name,
            prefix: config.prefix,
            features: {
                support: {
                    supportRole: undefined,
                    ticketGreetingMessage: undefined,
                    ticketMaxTicketCount: undefined,
                    ticketCategory: undefined,
                    ticketLogChannel: undefined
                },
                moderation: {
                    filteredWords: [],
                    reason: "AutoMod | %s",
                    punishments: [
                        { action: "WARN", max: 3 },
                        { action: "MUTE", max: 5, duration: ms("30m"), multiplier: 2 },
                        { action: "KICK", max: 6 },
                        { action: "BAN", max: 7 }
                    ],
                    history: new Map()
                },
                greeting: {
                    welcomeChannel: undefined,
                    welcomeMessage: undefined,
                    goodbyeChannel: undefined,
                    goodbyeMessage: undefined
                },
                maintenance: {
                    maintenanceCategory: undefined,
                    overwrites: null
                },
                imageOnlyChannels: [],
                textOnlyChannels: [],
                disabled: new Map()
            },
            toggle: {
                backup: false,
                channel: {
                    imageOnly: false,
                    textOnly: false
                },
                greeting: {
                    goodbye: false,
                    welcome: false
                },
                inviteTracker: false,
                music: true,
                moderation: {
                    actionLogs: true,
                    autoSlowdown: false,
                    autoMod: false,
                    verification: true
                },
                support: true
            }
        });

        try {
            const doc = await newGuild.save();
            return doc;
        } catch(e) {
            if(e) throw e;
        }
    }

    /**
     * Check if a channel is listed in special/featured channels
     * @param {Channel} channel 
     * @param {Document} guildSettings 
     */
    static checkChannelFeature(channel, guildSettings) {
        return guildSettings.features.imageOnlyChannels.includes(channel.id) ? "image" : "text";
    }
};

Util.CONSTANTS = {
    EMOJI: {
        a: '🇦', b: '🇧', c: '🇨', d: '🇩',
        e: '🇪', f: '🇫', g: '🇬', h: '🇭',
        i: '🇮', j: '🇯', k: '🇰', l: '🇱',
        m: '🇲', n: '🇳', o: '🇴', p: '🇵',
        q: '🇶', r: '🇷', s: '🇸', t: '🇹',
        u: '🇺', v: '🇻', w: '🇼', x: '🇽',
        y: '🇾', z: '🇿', 0: '0⃣', 1: '1⃣',
        2: '2⃣', 3: '3⃣', 4: '4⃣', 5: '5⃣',
        6: '6⃣', 7: '7⃣', 8: '8⃣', 9: '9⃣',
        10: '🔟', '#': '#⃣', '*': '*⃣',
        '!': '❗', '?': '❓',
    }
};

Util.ImageRegex = new RegExp(/(.jpg|.jpeg|.png|.gif|.bmp|.cod|.ief|.jpe|.jfif|.svg|.tif|.tiff|.ras|.ico|.cmx|.pnm|.pbm|.pgm|.ppm|.rgb|.xbm|.xpm|.xwd)$/i);

module.exports = exports = Util;