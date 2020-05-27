// commands.js
// ===========
const rutil = require(`./rutil`);

module.exports = {
    help,
};

/**
 * Print the available REMi commands to user in Discord.
 * @param {parameter} msg User command and argument(s).
 */
function help(msg) {
    msg.channel.send(`**%roll** - roll for a monster!\n` + 
                                `**%help** - list commands\n` +
                                `**%claimid** ***<ID>*** - claim a monster by ID\n` + 
                                `**%monbox** - print your monster box\n` +
                                `**%myrolls** - print your rolls\n`);
}