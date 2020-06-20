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