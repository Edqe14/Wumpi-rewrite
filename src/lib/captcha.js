const Canvas = require("canvas");

Canvas.registerFont(__dirname+'/fonts/Moms_typewriter.ttf', { family: "typewriter"});

module.exports = exports = class Captcha {
    /**
     * @param {Object} options
     * @param {Array} [options.charPool]
     * @param {Boolean} [options.confuse=true]
     */
    constructor(options={
        charPool: ('abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + '23456789').split(''),
        confuse: true
    }) {
        this.pool = options.charPool;
        this.confuse = options.confuse;
    }

    /**
     * Flags user as suspicious or no
     * @param {User} user 
     */
    static checkUser(user) {
        const checkCreation = (Date.now() - user.createdTimestamp) >= 604800000; // 1 week
        const hasAvatar = Boolean(user.avatarURL());
        const hasFlags = user.flags.toArray().some(f => (f !== 'HOUSE_BALANCE' && f !== 'HOUSE_BRAVERY' && f !== 'HOUSE_BRILLIANCE'));
        const isBot = user.bot;

        return isBot ? false : (checkCreation && hasAvatar && hasFlags);
    }

    generateRandomText(len) {
        let lenp = this.pool.length,
            res = '';
        for(let i = 0;i < len;i++) {
            res += this.pool[Math.floor(Math.random() * lenp)];
        }
        return res;
    }

    generateImage() {
        const canvas = Canvas.createCanvas(180, 57);
        const ctx = canvas.getContext('2d');
        const ctext = this.generateRandomText(6);
        const text = this.generateRandomText(6);

        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        if(this.confuse) {
            ctx.beginPath();
            ctx.font = '34px Arial';
            ctx.rotate(Math.round(Math.random() * (.02-(-.04)))-.05);
            ctx.strokeStyle = '#adc';
            ctx.strokeText(ctext, Math.round(Math.random() * (16-14))+14, Math.round(Math.random() * (56-44))+44);
        }

        let rotate = Math.round(Math.random() * (.03-(-.06)))-.06;
        ctx.beginPath();
        ctx.strokeStyle = '#0088cc';
        ctx.font = '36px \"typewriter\"';
        ctx.rotate(rotate);
        ctx.strokeText(text, Math.round(Math.random() * (16-14))+14, Math.round(Math.random() * (54-42))+42);

        ctx.strokeStyle = '#0088ccc1' // '#3b5b01c1';
        for(let i = 0; i < 5; i++) {
            const rand = Math.floor(Math.floor(Math.random() * (16-8))+8)+rotate
            ctx.beginPath();
            ctx.moveTo(Math.round(Math.random() * (24-16))+16+rand, Math.round(Math.random() * (48-16))+16+rand);
            ctx.lineTo(Math.round(Math.random() * (148-120))+120+rand, Math.round(Math.random() * (48-16))+16+rand);
            ctx.stroke();
        }

        const buffer = canvas.toBuffer();
        return {
            buffer,
            text
        };
    }
}