const { Client, Message } = require("discord.js");
const Collection = require("@discordjs/collection");
const Guild = require("../schemas/guild.js");
const { newGuildData, checkChannelFeature } = require("../lib/util.js");

/**
 * @param {Client} client Discord.js Client instance
 */
module.exports = exports = (client, config) => {
    const cooldowns = client.cooldowns = new Collection();

    /**
     * @param {Message} message
     */
    client.on('message', async message => {
        if(message.author == client.user) return;

        Guild.findOne({
            id: message.guild.id
        }, async(e, guild) => {
            if(e) throw e;
            if(!guild) guild = await newGuildData(message.guild, config);

            const prefix = guild.prefix,
                  args = message.content.slice(prefix.length).split(' '),
                  cmd = args.shift().toLowerCase();
  
            const c = client.commands.get(cmd) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmd));

            const feature = checkChannelFeature(message.channel, guild);
            if (feature == "image" && cmd !== "imageonly") {
                const attachments = message.attachments;
                const embed = message.embeds;

                const check = attachments.map((a) => a.name).concat(embed.map((e) => e.url)).some((u) => client.Util.ImageRegex.test(u)) || false;
                if (!check) {
                    message.delete({ timeout: 50 });
                    return message.channel.send(`This channel is image only, please attach or send a link that includes a image.`).then(m => m.delete({ timeout: 5000 }));
                }
            } else if(feature == 'text' && message.attachments.size > 0) {
                message.delete({ timeout: 50 });
                return message.channel.send(`This channel is text only`).then(m => m.delete({ timeout: 5000 }));
            }

            if(!c) return;

            if (c.permissionsRequired && message.channel.type !== "dm") {
                if (!message.member.hasPermission(c.permissionsRequired)) return message.reply(`You don\'t have enough permissions to run that command! You need permissions \`${c.permissionsRequired}\` to run that command.`);
            }

            if (c.guildOnly && message.channel.type !== 'text') return message.reply('I can\'t execute that command inside a dm!');
        
            if (c.args && !args.length) {
                const reply = `You didn't provide any arguments, ${message.author}!`;

                if (c.usage) {
                    reply += `\nThe proper usage would be: \`${prefix}${c.name} ${c.usage}\``;
                }

                return message.channel.send(reply);
            }

            if (!cooldowns.has(c.name)) cooldowns.set(c.name, new Collection());

            const now = Date.now();
            const timestamps = cooldowns.get(cmd) || cooldowns.get(client.aliases.get(cmd));
            const cooldownAmount = c.cooldown * 1000 || c.cooldown * 1000;
        
            if (timestamps && timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    message.delete({ timeout: 5000 });
                    return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the command.`).then(m => m.delete({ timeout: 5000 }));
                }
            }
        
            if(c) c.run(client, message, args, prefix);
        
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        })
    });
}