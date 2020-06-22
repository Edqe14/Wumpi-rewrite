const { Client } = require("discord.js");
const { format } = require("util");
const Guild = require('../schemas/guild.js');
const { newGuildData } = require("../lib/util.js");

/**
 * @param {Client} client Discord.js Client instance
 */
module.exports = exports = (client, config) => client.on('ready', () => {
    console.log(`\nReady to use`);

    client.guilds.cache.array().forEach(g => {
        Guild.findOne({
            id: g.id
        }, async(e, guild) => {
            if(e) throw e;
            if(!guild) return await newGuildData(g, config);
            else {
                /**
                 * @type {Map}
                 */
                const muted = guild.features.moderation.muted;
                muted.forEach(async (m, k) => {
                    const member = await g.members.fetch(m.id);
                    if((m.end-Date.now()) <= 0) {
                        await member.roles.remove(m.roleID);
                        muted.delete(k);
                    } else {
                        const remaining = m.end-Date.now();
                        client.setTimeout(async() => await member.roles.remove(m.roleID), remaining);
                    }
                });
            }
        });
    });

    const options = [
        { activity: { name: `%s Users`, type: 'LISTENING' }, type: 0 },
        { activity: { name: `%s Servers`, type: 'WATCHING' }, type: 1 },
        { activity: { name: `%s Commands`, type: 'LISTENING' }, type: 2 },
        { activity: { name: `with Wumpus`, type: 'PLAYING' } }
    ];

    function changeStatus() {
        const op = JSON.parse(JSON.stringify(options[Math.floor(Math.random() * options.length)]));
        const replace = op.type == 0 ? client.guilds.cache.reduce((a, g) => a + g.memberCount, 0) : op.type == 1 ? client.guilds.cache.size : client.commands.size;
    
        op.activity.name = typeof op.type == 'number' ? format(op.activity.name, replace) : op.activity.name;
        client.user.setPresence(op);

        client.setInterval(changeStatus, 45000);
    }
    changeStatus();
});