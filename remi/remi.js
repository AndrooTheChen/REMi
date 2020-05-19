// remij.s
// =======
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const mongoUser = require('./mongoUsers');
const rutil = require ('./rutil');
const monster = require('./monster');

// connect to database
mongoUser.connectDB().then((status) => {
    if (status == `success`) {
        rutil.log(`connectDB returned: ${status}`);
    } else {
        rutil.warn(`connectDB returned failure, shutting down`);
        process.exit(1);
    }
});

/**
 * Output console log when bot is logged in.
 */
client.on('ready', () => {
    rutil.log(`Logged in as ${client.user.tag}!`);
});

/**
 * Reply to all commands, this is an event listener.
 */
client.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `%`
    if (msg.content.substring(0, 1) != '%') 
        return;
    let args = msg.content.substring(1).split(' ');
    const cmd = args[0];
       
    // argument for some commands
    args = args.splice(1);

    const user = msg.author.username;
    let ffLater;
    let timeDiff;
    let now;

    // commands:
    switch(cmd) {
        // %ping
        case 'ping':
            msg.reply("pong!");
        break;

        // %help
        case 'help':
            msg.channel.send(`**%roll** - roll for a monster!\n` + 
                            `**%help** - list commands\n` +
                            `**%claimid** ***<ID>*** - claim a monster by ID\n` + 
                            `**%monbox** - print your monster box\n` +
                            `**%myrolls** - print your rolls\n`);
        break;

        // %roll
        case 'roll':
        case 'r':
            mongoUser.checkUser(user);

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
        break;

        // %claim <monsterName>
        case 'claim':
        case 'cn':
            
        break;

        // %claimid <claimId>
        case 'claimid':
        case 'ci':
            mongoUser.checkUser(user);
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
            
        break;

        case 'monbox':
        case 'mon':
        case 'mb':
            mongoUser.checkUser(user);
            mongoUser.printMonBox(user).then((monBox) => {
                msg.channel.send(`**${user}'s**`
                + ` monster box:\n${rutil.monPrint(monBox)}`);
            });
        break;

        // %myrolls
        case 'myrolls':
        case 'mr':
            mongoUser.checkUser(user);
            mongoUser.checkRolls(user).then((rolls) => {
                msg.channel.send(`**${user}** you currently have **${rolls}** rolls`);
                if (rolls == 0) {
                    mongoUser.getClaimTimestamp(user).then((rollTime) => {
                        ffLater = new Date(rollTime.getTime() + 45 *60000);
                        timeDiff = ffLater - reset;
                        msg.channel.send(`Wait ${rutil.printTimeStamp(timeDiff)} for claims to refresh.`);
                    });
                }
            });
        break;

        // %myclaims
        case 'myclaims':
        case 'mc':
            mongoUser.checkUser(user);
            mongoUser.checkClaims(user).then((claims) => {
                msg.channel.send(`**${user}** you currently have **${claims}** claims`);
            });
        break;

        // DEBUG ========================================

        // %test
        case 'test':
            rutil.log(`Testing checkUser`);
            mongoUser.checkUser(user);
            rutil.log(`userCheck finished`);
        break;

        // print db
        case `print`:
            mongoUser.printUsers();
            mongoUser.printRolled();
        break;

        case `collections`:
            mongoUser.printCollections();
        break;

        // %time
        case `time`:
            const now = new Date();
            mongoUser.getRollTimestamp(user).then((time) => {
                rutil.log(`Time returned: ${time}`);
                const diff = now - time;
                rutil.log(`Time diff: ${diff}`);
                msg.channel.send(`Time since last roll: ${rutil.printTimeStamp(diff)}`);
            });
            
        break;

        // %timediff
        case `td`:
            const reset = new Date();
            mongoUser.getRollTimestamp(user).then((timestamp) => {
                const ffLater = new Date(timestamp.getTime() + 45 *60000);
                rutil.log(`45 min after last roll is ${rutil.printTimeStamp(ffLater)}`);
                const diff = (ffLater > reset) ? ffLater - reset : 0;
                msg.channel.send(`Need to wait ${rutil.printTimeStamp(diff)}`);
            });
        break;

        // %rr - reset rolls
        case `rr`:
            rutil.warn(`Resetting ${user} to 10 rolls`)
            mongoUser.setRolls(user, 10);
        break;

        // %rc - reset claims
        case `rc`:
            rutil.warn(`Resetting ${user} to 3 claims`)
            mongoUser.setClaims(user, 3);
        break;

        // DEBUG ========================================

    }
});

// login to the bot
client.login(auth.token);

// shut down REMi
process.on('SIGINT', () => {
    rutil.warn(`\nSIGINT received! Shutting down REMi`);
    mongoUser.mongo_client.close();
    process.exit(0);
});
