const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

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
    }
});


// login to the bot
client.login(auth.token);
