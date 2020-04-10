const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

const readline = require('readline');
const fs = require('fs');

const mon_db = [];

const readInterface = readline.createInterface({
    input: fs.createReadStream(`${process.env.WINHOME}Androo/bots/remy/rem_urls.txt`)
});

readInterface.on('line', function(line) {
    let newline = line.split('@')
    let mon = {
        name: newline[1],
        url: newline[0]
    }
    mon_db.push(mon);
    // console.log(`${mon.name}, ${mon.url}`);
});

// output console log when bot is logged in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `%`
    if (msg.content.substring(0, 1) != '%') 
        return;
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
       
    args = args.splice(1);

    switch(cmd) {
        case 'ping':
            msg.reply("pong!");
        break;
        case 'roll':
            roll = mon_db[Math.floor(Math.random() * mon_db.length)];
            msg.reply(`You rolled ${roll.name}!`, {files:[roll.url]});
        break;
    }
});


// login to the bot
client.login(auth.token);
