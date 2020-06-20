module.exports = exports = {
    name: "test",
    description: "test command",
    cooldown: 10,
    permissionsRequired: null,
    aliases: [],
    usage: "",
    run(_, message) {
        message.channel.send('test')
    }
}