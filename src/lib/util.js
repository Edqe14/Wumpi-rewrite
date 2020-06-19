const { Util: DiscordUtil, Client } = require('discord.js');
const { readdir } = require('fs');

class Util extends DiscordUtil {
    /**
     * Initiate handlers
     * @param {Client} client Discord.js Client instance
     */
    static initiate(client) {
        const config = client.config = require('../config.json');
        client.Util = Util;

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

module.exports = exports = Util;