// remij.s
// =======
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const mongoUser = require('./mongoUsers');
const rutil = require ('./rutil');
const monster = require('./monster');
const cmds = require('./commands');

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
});

// login to the bot
client.login(auth.token);

// shut down REMi
process.on('SIGINT', () => {
    rutil.warn(`\nSIGINT received! Shutting down REMi`);
    mongoUser.mongo_client.close();
    process.exit(0);
});
