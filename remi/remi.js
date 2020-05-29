// remij.s
// =======
const Discord = require('discord.js');
const {MessageEmbed} = require('discord.js')
const client = new Discord.Client();
const auth = require('./auth.json');
const mongoUser = require('./mongoUsers');
const rutil = require ('./rutil');
const cmds = require('./commands');

let user;

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
 * Claim a monster with heart reactions. Exit function immediately if message 
 * doesn't contain any embeds or read reaction isn't a type of heart. This is
 * because only embedded messages should be interactable and only hearts 
 * reactions can be used to claim monsters.
 */
client.on('messageReactionAdd', (reaction, user) => {
    if (!reaction.message.embeds.length || !rutil.hearts.has(reaction.emoji.identifier)) return;

    rutil.log(`User ${user.username} claiming ${reaction.message.embeds[0].title}`);
    cmds.claim(user.username, reaction.message.embeds[0].title, reaction.message);
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
    let now;
    let reset;
    let randomColor;
    let embed;
    
    // argument for some commands
    args = args.splice(1);

    // user inputting command
    user = msg.author.username;

    // commands:
    mongoUser.checkUser(user).then(() => {
        rutil.log(`[USER COMMAND] ${user} ran cmd: ${cmd}`);
        switch(cmd) {
            // %ping
            case 'ping':
                msg.reply("pong!");
            break;
    
            // %help
            case 'help':
                cmds.help(msg);
            break;
    
            // %roll
            case 'roll':
            case 'r':
                cmds.roll(user, msg);
            break;
    
            // %claim <monsterName>
            case 'claim':
            case 'cn':
                
            break;
    
            // %claimid <claimId>
            case 'claimid':
            case 'ci':
                cmds.claimid(user, args, msg);                
            break;
    
            case 'monbox':
            case 'mon':
            case 'mb':
                cmds.monbox(user, msg);
            break;
    
            // %myrolls
            case 'myrolls':
            case 'mr':
                cmds.myrolls(user, msg);
            break;
    
            // %myclaims
            case 'myclaims':
            case 'mc':
                cmds.myclaims(user, msg);
            break;
    
            // DEBUG ========================================
            // These commands will be removed or switched to an Admin-only
            // role in the future.
    
            // %test
            case 'test':
                rutil.log(`Testing checkUser`);
                // mongoUser.checkUser(user);
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
                now = new Date();
                mongoUser.getRollTimestamp(user).then((time) => {
                    rutil.log(`Time returned: ${time}`);
                    const diff = now - time;
                    rutil.log(`Time diff: ${diff}`);
                    msg.channel.send(`Time since last roll: ${rutil.printTimeStamp(diff)}`);
                });
                
            break;
    
            // %timediff
            case `td`:
                reset = new Date();
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

            // %msg
            case `msg`:
                randomColor = Math.floor(Math.random()*16777215).toString(16);
                embed = new MessageEmbed()
                .setTitle('Artemis')
                .setColor(randomColor)
                .setDescription('uwu kawaiiiii')
                .setImage('http://puzzledragonx.com/en/img/monster/MONS_571.jpg');
                msg.channel.send(embed);
            break;
    
            // DEBUG ========================================
    
        }
    });
});

// login to the bot
client.login(auth.token);

// shut down REMi
process.on('SIGINT', () => {
    rutil.warn(`\nSIGINT received! Shutting down REMi`);
    mongoUser.mongo_client.close();
    process.exit(0);
});
