// commands.js
// ===========
const mongoUser = require('./mongoUsers');
const monster = require('./monster');
const rutil = require(`./rutil`);

module.exports = {
    claimid,
    help,
    monbox,
    myrolls,
    myclaims,
    roll,
};

// Local variables dealing with time
let ffLater;
let timeDiff;
let now;

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

/**
 * Roll a monster for the user. First check that the user has
 * enough rolls. If this is the user's first roll (originally
 * had 10) make sure to record the time at which this happened
 * for refresh timer later. If the user has enough rolls, call
 * the roll function and return the monster's name. Also decrement
 * number of rolls if eligible.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function roll(user, msg) {
    mongoUser.checkRolls(user).then((numRolls) => {
        if (numRolls == 0) {
            msg.channel.send(`${user} has no rolls left!`);
            const roll_now = new Date();
            mongoUser.getRollTimestamp(user).then((rollTime) => {
                ffLater = new Date(rollTime.getTime() + 45 *60000);
                timeDiff = (ffLater > roll_now) ? ffLater - roll_now : 0;
                msg.channel.send(`Need to wait ${rutil.printTimeStamp(timeDiff)} for rolls to reset`);
            });
        } else {
            if (numRolls == 10) {
                // add timestamp for the first roll
                mongoUser.addRollTimestamp(user);
            }

            roll = monster.rollMonster();
            mongoUser.addRollToBuffer(roll.name, roll.url).then((claimId) => {
                rutil.log(`${user} rolled ${roll.name} with active rolled ID ${claimId}`);
                msg.channel.send(`**${user}** rolled **${roll.name}**!`, {files:[roll.url]});

                setTimeout(() => {
                    msg.channel.send(`Claim ID is **${claimId}**, claim with:\n ~~%claim ` + 
                    `**${roll.name}**~~(WIP)\nor\n%claimid **${claimId}**`)
                }, 400);

                mongoUser.setRolls(user, numRolls-1);
                msg.channel.send(`${user} you have **${numRolls-1}** roll(s) remaining.`)
            });
        }
    });
}

/**
 * Allow a user to claim a rolled monster and put it in their monster box. Check
 * That the user has enough claims first and also that the claim ID
 * is valid.
 * @param {string} user Username for user requesting info.
 * @param {parameter} args Claim ID for a rolled monster.
 * @param {parameter} msg User command and argument(s).
 */
function claimid(user, args, msg) {
    mongoUser.checkClaims(user).then((numClaims) => {
        // check if user has enough claims
        if (numClaims == 0) {
            msg.channel.send(`**${user}** has no claims left!`);
            const claim_now = new Date();
            mongoUser.getClaimTimestamp(user).then((claimTime) => {
                ffLater = new Date(claimTime.getTime() + 45 *60000);
                timeDiff = (ffLater > claim_now) ? ffLater - claim_now : 0;
                msg.channel.send(`Need to wait ${rutil.printTimeStamp(timeDiff)} for claims to reset`);
            });
        } else {
            if (numClaims == 3) {
                // record the time for the user's first claim
                mongoUser.addClaimTimestamp(user);
            }

            console.log(`User has enough claims`);
            mongoUser.claimMonsterById(user, args).then((claimed) => {
                if (claimed.toString() == `FAILED`) {
                    msg.channel.send(`**__Error!__** ID ${args} is not a valid ID.`);
                } else {
                    msg.channel.send(`**${user}** claimed **${claimed.toString()}**!` +
                                        `\nyou have **${numClaims-1}** claim(s) remaining.`);
                    rutil.log(`${user} claimed ${claimed}`);
                }

                // update user's remaining claims
                mongoUser.setClaims(user, numClaims-1);
            });
        }
    });
}

/**
 * Print a user's monster box to the Discord chat.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function monbox(user, msg) {
    mongoUser.printMonBox(user).then((monBox) => {
        msg.channel.send(`**${user}'s**`
        + ` monster box:\n${rutil.monPrint(monBox)}`);
    });
}

/**
 * Let users check how many rolls they have. If they have 0, print
 * how much time left until their number of rolls resets to 10.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function myrolls(user, msg) {
    mongoUser.checkRolls(user).then((rolls) => {
        msg.channel.send(`**${user}** you currently have **${rolls}** rolls`);
        if (rolls == 0) {
            now = new Date();
            mongoUser.getRollTimestamp(user).then((rollTime) => {
                ffLater = new Date(rollTime.getTime() + 45 * 60000);
                timeDiff = ffLater - now;
                msg.channel.send(`Wait ${rutil.printTimeStamp(timeDiff)} for rolls to refresh.`);
            });
        }
    });
}

/**
 * Let users check how many claims they have. If they have 0, print
 * how much time left until their number of claims resets to 3.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function myclaims(user, msg) {
    mongoUser.checkClaims(user).then((claims) => {
        msg.channel.send(`**${user}** you currently have **${claims}** claims`);
        if (claims == 0) {
            now = new Date();
            mongoUser.getClaimTimestamp(user).then((claimTime) => {
                ffLater = new Date(claimTime.getTime() + 45 * 60000);
                timeDiff = ffLater - now;
                msg.channel.send(`Wait ${rutil.printTimeStamp(timeDiff)} for claims to refresh.`)
            });
        }
    });
}