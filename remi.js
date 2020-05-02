// remij.s
// =======
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const mongoUser = require('./mongoUsers');
const hello = require('./hello');

// connect to DB
const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const mongo_client = new MongoClient(uri);

// get collection
const users = connectDB(mongo_client).then();

async function connectDB(mongo_client) {
    try {
        await mongo_client.connect();
        
        // query for collection
        const db = mongo_client.db("remiDB");
        console.log(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");
    } catch (ex) {
        console.log(`Connection failed! Error: ${ex}`);
    } finally {
        console.log(`Connection attempt finished.`);
    }

    return users;
}

// for parsing text files
const readline = require('readline');
const fs = require('fs');

// store monsters in arrays
const three_star_drops = [];
const four_star_drops = [];
const five_star_drops = [];
const five_star_gods = [];
const GFE = [];

// Read in the monsters, segregate, and store
// const monFile = `${process.env.WINHOME}Androo/bots/remy/monsters`;
const monFile = `${process.env.HOME}/Workspace/remi/monsters`;

const readThreeStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/three_star_drops.txt`)
});
const readFourStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/four_star_drops.txt`)
});
const readFiveStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/five_star_drops.txt`)
});
const readFiveStarGod = readline.createInterface({
    input: fs.createReadStream(`${monFile}/five_star_gods.txt`)
});
const readGFE= readline.createInterface({
    input: fs.createReadStream(`${monFile}/GFE.txt`)
});

readThreeStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
    };
    three_star_drops.push(mon);
});
readFourStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
    };
    four_star_drops.push(mon);
});
readFiveStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
    };
    five_star_drops.push(mon);
});
readFiveStarGod.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
    };
    five_star_gods.push(mon);
});
readGFE.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
    };
    GFE.push(mon);
});

/**
 * Roll a monster.
 * @return {url, name} The key-value pair of the roll
 */
function rollMonster() {
    tier = Math.floor(Math.random() * 100) + 1;
    let drop;

    if (tier <= 10) {
        drop = three_star_drops[Math.floor(Math.random() * three_star_drops.length)];
    } else if (tier > 10 && tier <= 45) {
        drop = four_star_drops[Math.floor(Math.random() * four_star_drops.length)];
    } else if (tier > 45 && tier <= 90) {
        drop = five_star_drops[Math.floor(Math.random() * five_star_drops.length)];
    } else {
        drop = GFE[Math.floor(Math.random() * GFE.length)];
    }
    let roll = {
        url: drop.url,
        name: drop.name
    };

    return roll;
}

/**
 * Return the current time stamp.
 * @return HH:MM:SS time stamp as string
 */
function getTimeStamp() {
    var today = new Date();
    var date = today.getMonth() + '/' + today.getDay() + '/' + today.getFullYear();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    return date + ' ' + time;
}

/**
 * Output console log when bot is logged in.
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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
    var timestamp = getTimeStamp();
       
    args = args.splice(1);

    // Commands:
    switch(cmd) {
        // %ping
        case 'ping':
            msg.reply("pong!");
        break;

        // %roll
        case 'roll':
            roll = rollMonster();
            msg.channel.send(`**${msg.author.username}** rolled **${roll.name}**!`, {files:[roll.url]});
            // console.log(`${Object.getOwnPropertyNames(msg.author)}`);
            console.log(`[${timestamp} LOGGING]: ${msg.author.username} rolled ${roll.name}`);
        break;

        // %test
        case 'test':
            console.log(`Testing checkUser`);
            mongoUser.checkUser(msg.author.username);
            console.log(`userCheck finished`);
        break;

        // %help
        case 'help':
            msg.channel.send(`**%roll** - roll for a monster!\n**%help** - list commands`);
        break;
        
        case 'hello':
            hello.printHello();
        break;

        case 'add':
            hello.addTwo(400, 6);
        break;
        
        case 'bye':
            hello.printBye();
        break;

    }
});

// login to the bot
client.login(auth.token);

// shut down REMi
process.on('SIGINT', () => {
    console.log(`\nSIGINT received! Shutting down REMi`);
    process.exit(0);
});
