const { Client } = require('discord.js');
const express = require('express');
const { readFileSync, existsSync } = require('fs');
const https = require('https');

module.exports = exports = class Server {
    /**
     * Initiate Webserver
     * @param {Client} client Discord.js Client instance
     * @param {Object} [options={}] Server options
     * @param {Boolean} [options.useHttps=false] Enable HTTPS or not
     * @param {String} [options.keyPath=null] SSL key path (Only if HTTPS enabled)
     * @param {String} [options.certPath=null] SSL certificate path (Only if HTTPS enabled)
     * @param {String} [options.publicDir="public"] HTTP public directory
     * @param {String} [options.viewsDir="views"] Views directory
     * @param {String} [options.viewEngine=null] Express view engine
     * @param {Number} [options.port=3000] Webserver port
     */
    constructor(client, options={
        useHttps: false,
        keyPath: null,
        certPath: null,
        publicDir: "public",
        viewsDir: "views",
        viewEngine: null,
        port: 3000
    }) {
        if(!client || !(client instanceof Client)) throw new TypeError("Invalid client type");
        this.Client = client;
        this.Options = options;

        if(this.Options.useHttps) {
            const { keyPath, certPath } = this.Options;
            if(!keyPath || !certPath || !existsSync(keyPath) || !existsSync(certPath)) throw new Error("Invalid key/cert path");
        };

        this.app = express();
        try {
            if(this.Options.viewEngine) this.app.set('view engine', this.Options.viewEngine);
            this.app.set('views', this.Options.viewsDir);
            this.app.use(express.static(this.Options.publicDir));

            this.registerPages();

            this.Server = this.Options.useHttps ?
                https.createServer({
                    key: fs.readFileSync(this.Options.keyPath),
                    cert: fs.readFileSync(this.Options.certPath)
                }, this.app).listen(this.Options.port, () => console.log(`Listening on port ${this.Options.port}!`))
                :
                this.app.listen(this.Options.port, () => console.log(`Listening on port ${this.Options.port}!`))
        } catch(e) {
            if(e) throw e;
        };
        return this.app;
    };

    // TODO methods
    registerPages() {
        const app = this.app;

        app.get('/', (req, res) => {
            res.send("Hello World!")
        });
    }
}