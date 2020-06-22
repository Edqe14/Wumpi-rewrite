To-do
=====

1. Add more event handlers

2. Add more commands. Template:

```js
module.exports = exports = {
    name: "command name",
    description: "command description",
    cooldown: 10, // Command cooldown
    permissionsRequired: null, // Permission flag in array or null/undefined for nothing
    aliases: ["command alias 1", "command alias 2"],
    usage: "<usage>",
    run(client, message, args, prefix) {
        // Run code
    }
}
```

3. Finish HTTP/HTTPS Request handler (express)

4. Test mute methods
