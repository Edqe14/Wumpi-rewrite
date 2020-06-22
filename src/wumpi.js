require('dotenv').config({ path: __dirname+"/.env" });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(e => { if(e) throw e; }).then(() => console.log('Connected to MongoDB'));

require('./mute')

const { Client } = require('discord.js');
const { initiate } = require('./lib/util.js');
const client = new Client({ disableEveryone: true });

module.exports = exports = client;
initiate(client);

client.login(process.env.TOKEN)
    .then(() => console.log(`Logged in with ${client.user.username}#${client.user.discriminator}`))
    .catch(console.error);