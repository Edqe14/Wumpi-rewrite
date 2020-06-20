Wumpi Rewrite
=============

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://nodejs.org/en/)
[![forthebadge](https://forthebadge.com/images/badges/for-you.svg)](https://github.com/Edqe14/Wumpi-rewrite)

## Description

The goal of this bot is to provide a full suite of moderation commands and functions. The bot not only will be available to make a moderators life easier, but automate as much as it can. This extends to new member scans and anti bot players. It also allows for automating the muting of spammers, swearing, racial slurs, and raiding. This will improve the overall security of your server. It also includes a backup function which will keep a 24/7 backup of your server.
*PS: This project is a rewrite of [Wumpi](https://github.com/TheDrone7/Wumpi).*

Discord: <https://discord.gg/mPPBNty>

## Setup

1. Run `npm i` to install dependencies

2. Create a `.env` in src folder with following values:

```
TOKEN=<botToken>
MONGODB=<mongoDBconnectionURI>
```

3. Do additional configuration in `config.json`.

4. Run `npm start` or `node .` to run the bot

## Notes

1. Badword Filter already came with default values (Mostly included popular English swear/badwords). [Word List](https://github.com/web-mech/badwords/blob/master/lib/lang.json) [Package](https://www.npmjs.com/package/bad-words)

## Contributing

1. Fork this repository

2. Create a Pull Request and describe what exactly you change/add/remove and the reason

3. Submit the Pull Request and wait for response
