// remij.s
// =======
const Discord = require('discord.js')
const client = new Discord.Client()
const auth = require('./auth.json')
const mongoUser = require('./mongoUsers')
const rutil = require('./rutil')
const cmds = require('./commands')

// 1 if running without database for debug mode, 0 otherwise
let NO_DB = 0

// 1 if running remote connection to DB
let REMOTE_DB = 0 

// get commandline arguments
const args = process.argv.slice(2)[0]
if (args === 'debug') {
  rutil.warn('RUNNING IN DEBUG MODE')
  NO_DB = 1
} else if (args === 'pemi') {
  rutil.warn('RUNNING REMOTE CONNECTION TO REMIDB')
  REMOTE_DB = 1;
}

// connect to database
mongoUser.setUp(REMOTE_DB)
if (NO_DB === 0) {
  mongoUser.connectDB().then((status) => {
    if (status === 'success') {
      rutil.log(`connectDB returned: ${status}`)
    } else {
      rutil.warn('connectDB returned failure, shutting down')
      process.exit(1)
    }
  })
}

/**
 * Output console log when bot is logged in.
 */
client.on('ready', () => {
  rutil.log(`Logged in as ${client.user.tag}!`)
})

/**
 * Claim a monster with heart reactions. Exit function immediately if message
 * doesn't contain any embeds or read reaction isn't a type of heart. This is
 * because only embedded messages should be interactable and only hearts
 * reactions can be used to claim monsters.
 */
client.on('messageReactionAdd', (reaction, user) => {
  if (!reaction.message.embeds.length || !rutil.hearts.has(reaction.emoji.identifier)) return

  rutil.log(`User ${user.username} claiming ${reaction.message.embeds[0].title}`)
  cmds.claim(user.username, reaction.message.embeds[0].title, reaction.message)
})

/**
 * Reply to all commands, this is an event listener.
 */
client.on('message', msg => {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `%`
  if (msg.content.substring(0, 1) !== '%') { return }
  let args = msg.content.substring(1).split(' ')
  const cmd = args[0]

  // argument for some commands
  args = args.splice(1)

  // user inputting command
  const user = msg.author.username

  // commands:
  if (NO_DB === 1) {
    // don't check if the user is in the DB if we are running detatched from DB
    msg.channel.send('***WARNING:***  Executing command without Database! Some commands may not work.')
    cmds.exec(cmd, user, msg)
  } else {
    mongoUser.checkUser(user).then(() => {
      cmds.exec(cmd, user, msg)
    })
  }
})

// login to the bot
client.login(auth.token)

// shut down REMi
process.on('SIGINT', () => {
  rutil.warn('\nSIGINT received! Shutting down REMi')
  mongoUser.shutdown()
  process.exit(0)
})

process.on('SIGTERM', () => {
  rutil.warn('\nSIGINT received! Shutting down REMi')
  mongoUser.shutdown()
  process.exit(0)
})
