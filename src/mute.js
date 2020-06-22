module.exports = exports = (client) => {
    /**
     * Check if the user is muted or not
     * @param {User} user 
     * @param {Map} map 
     */
    client.Util.isMuted = (user, map) => map.has(user.id);

    /**
     * Mute a member
     * @param {Client} client
     * @param {GuildMember} member 
     * @param {Docs} setting 
     * @param {Role} role
     * @param {User} staff 
     * @param {Object} [options={}] 
     * @param {Boolean} [options.temp=false]
     * @param {Number|String|null} [options.duration=null]
     * @param {String} [options.reason=""]
     */
    client.Util.mute = async (client, member, setting, role, staff, options={
        temp: false,
        duration: null,
        reason: ""
    }) => {
        const user = member.user;
        /**
         * @type {Map}
         */
        const map = setting.features.moderation.muted;
        if(map.has(user.id)) return {
            success: false,
            reason: "Already Muted"
        };
        else {
            map.set(user.id, {
                id: user.id,
                username: user.username,
                duration: options.duration,
                end: options.temp ? Date.now() + options.duration : null,
                reason: options.reason,
                roleID: role.id,
                issuerID: staff.id,
                issuer: staff.username 
            });

            const data = UserData.findOne({ id: user.id }) || await client.Util.newUserData(user);
            data.violation.push({
                type: "MUTE",
                guild: guild.id,
                duration: options.duration,
                permanent: !options.temp
            });

            try {
                await setting.save();
                await data.save();

                /**
                 * @type {GuildMember}
                 */
                const member = await member.roles.add(role);

                if(options.temp) client.setTimeout(() => member.roles.remove(role), options.duration);

                return {
                    success: true,
                    member
                }
            } catch(e) {
                if(e) throw e;
            }
        }
    }

    /**
     * Unmute a member
     * @param {GuildMember} member 
     * @param {Docs} setting 
     * @param {Role} role
     */
    client.Util.unmute = async (member, setting, role) => {
        const user = member.user;
        /**
         * @type {Map}
         */
        const map = setting.features.moderation.muted;
        if(!map.has(user.id)) return {
            success: false,
            reason: "Not Muted"
        };
        else {
            try {
                map.delete(user.id);
                await setting.save();

                return {
                    success: true,
                    member: await member.roles.remove(role)
                }
            } catch(e) {
                if(e) throw e;
            }
        }
    }
}