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
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
       
    // argument for some commands
    args = args.splice(1);

    // commands:
    switch(cmd) {
        // %ping
        case 'ping':
            msg.reply("pong!");
        break;

        // %help
        case 'help':
            msg.channel.send(`**%roll** - roll for a monster!\n**%help** - list commands`);
        break;

        // %roll
        case 'roll':
        case 'r':
            mongoUser.checkUser(msg.author.username);
            roll = monster.rollMonster();
            mongoUser.addRollToBuffer(roll.name, roll.url).then((claimId) => {
                rutil.log(`${msg.author.username} rolled ${roll.name} with active rolled ID ${claimId}`);
                msg.channel.send(`**${msg.author.username}** rolled **${roll.name}**!`, {files:[roll.url]});

                setTimeout(() => {
                    msg.channel.send(`Claim ID is **${claimId}**, claim with:\n %claim ` + 
                    `**${roll.name}**\nor\n%claimid **${claimId}**`)
                }, 250);

            });
                
        break;

        // %claim <monsterName>
        case 'claim':
        case 'cn':
            
        break;

        // %claimid <claimId
        case 'claimid':
        case 'ci':
            mongoUser.checkUser(msg.author.username);
            mongoUser.claimMonsterById(msg.author.username, args).then((claimed) => {
                if (claimed.toString() == `FAILED`) {
                    msg.channel.send(`**__Error!__** ID ${args} is not a valid ID.`);
                } else {
                    msg.channel.send(`**${msg.author.username}** claimed **${claimed.toString()}**!`);
                    rutil.log(`${msg.author.username} claimed ${claimed}`);
                }
            });
        break;

        // %myrolls
        case 'myrolls':
        case 'mr':
            mongoUser.checkUser(msg.author.username);
            mongoUser.checkRolls(msg.author.username).then((rolls) => {
                msg.channel.send(`**${msg.author.username}** you currently have ${rolls} rolls`);
            });
        break;

        // %myclaims
        case 'myclaims':
        case 'mc':
            mongoUser.checkUser(msg.author.username);
            mongoUser.checkClaims(msg.author.username).then((claims) => {
                msg.channel.send(`**${msg.author.username}** you currently have ${claims} claims`);
            });
        break;

        // DEBUG ========================================

        // %test
        case 'test':
            rutil.log(`Testing checkUser`);
            mongoUser.checkUser(msg.author.username);
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
