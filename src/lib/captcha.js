const Canvas = require("canvas");
const util = require('util');

Canvas.registerFont(__dirname+'/fonts/Moms_typewriter.ttf', { family: "typewriter"});

module.exports = exports = class Captcha {
    /**
     * @param {Object} options
     * @param {Array} [options.charPool]
     * @param {Boolean} [options.confuse=true]
     */
    constructor(options={
        charPool: ('abcdefghijklmnopqrstuvwxyz' + 'abcdefghijklmnopqrstuvwxyz'.toUpperCase() + '0123456789').split(''),
        confuse: true
    }) {
        this.pool = options.charPool;
        this.confuse = options.confuse;
    }

    generateRandomText(len) {
        let lenp = this.pool.length,
            res = '';
        for(let i = 0;i < len;i++) {
            res += pool[Math.floor(Math.random() * lenp)];
        }
        return res;
    }

    async generateImage() {
        const canvas = Canvas.createCanvas(370, 120);
        const ctx = canvas.getContext('2d');
        const len = this.pool.length;
        const pool = this.pool;
        const ctext = this.randomText(pool, len);
        const text = this.randomText(pool, len);

        ctx.fillStyle = "#eeeeee";
        ctx.fillRect(0, 0, 150, 32);
        
        if(this.confuse) {
            ctx.beginPath();
            ctx.font = '30px Arial';
            ctx.rotate(Math.round(Math.random() * (-.04, .02))-.05);
            ctx.strokeStyle = '#adc';
            ctx.strokeText(ctext, Math.round(Math.random() * (20-15))+15, 26);
        }

        ctx.beginPath();
        ctx.strokeStyle = '#0088cc';
        ctx.font = '26px \"typewriter\"';
        ctx.rotate(Math.round(Math.random() * (-.02, .04)));
        ctx.strokeText(text, Math.round(Math.random() * (20-15))+15, 26);

        try {
            const toBuffer = util.promisify(canvas.toBuffer);
            const buffer = await toBuffer();

            return {
                buffer,
                text
            };
        } catch(e) {
            if(e) throw e;
        }
    }
}