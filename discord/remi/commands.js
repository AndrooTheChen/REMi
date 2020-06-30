// commands.js
// ===========
const Discord = require('discord.js')
const { MessageEmbed } = Discord
const mongoUser = require('./mongoUsers')
const monster = require('./monster')
const rutil = require('./rutil')

module.exports = {
  claim,
  claimid,
  exec,
  help,
  monbox,
  myrolls,
  myclaims,
  roll
}

// Local variables dealing with time
let ffLater
let timeDiff
let now

// Local variables for embedding messages
let embed
let randomColour

/**
 * Parse command and execute the correct one
 * @param {string} cmd Command executed by user
 * @param {string} user User executing command
 * @param {string} msg Argument for command
 */
function exec (cmd, user, msg) {
  rutil.log(`[USER COMMAND] ${user} ran cmd: ${cmd}`)
  switch (cmd) {
    // %ping
    case 'ping':
      msg.reply('pong!')
      break

      // %help
    case 'help':
      help(msg)
      break

      // %roll
    case 'roll':
    case 'r':
      roll(user, msg)
      break

      // %claimid <claimId>
    case 'claimid':
    case 'ci':
      claimid(user, undefined, msg)
      break

    case 'monbox':
    case 'mon':
    case 'mb':
      monbox(user, msg)
      break

      // %myrolls
    case 'myrolls':
    case 'mr':
      myrolls(user, msg)
      break

      // %myclaims
    case 'myclaims':
    case 'mc':
      myclaims(user, msg)
      break

      // DEBUG ========================================
      // These commands will be removed or switched to an Admin-only
      // role in the future.

      // %test
    case 'test':
      rutil.log('Testing checkUser')
      // mongoUser.checkUser(user);
      rutil.log('userCheck finished')
      break

      // print db
    case 'print':
      mongoUser.printUsers()
      mongoUser.printRolled()
      break

    case 'collections':
      mongoUser.printCollections()
      break

      // %time
    case 'time':
      now = new Date()
      mongoUser.getRollTimestamp(user).then((time) => {
        rutil.log(`Time returned: ${time}`)
        const diff = now - time
        rutil.log(`Time diff: ${diff}`)
        msg.channel.send(`Time since last roll: ${rutil.printTimeStamp(diff)}`)
      })

      break

      // %timediff
    case 'td':
      (reset => {
        mongoUser.getRollTimestamp(user).then((timestamp) => {
          const ffLater = new Date(timestamp.getTime() + 45 * 60000)
          rutil.log(`45 min after last roll is ${rutil.printTimeStamp(ffLater)}`)
          const diff = (ffLater > reset) ? ffLater - reset : 0
          msg.channel.send(`Need to wait ${rutil.printTimeStamp(diff)}`)
        })
      })(new Date())
      break

      // %rr - reset rolls
    case 'rr':
      rutil.warn(`Resetting ${user} to 6 rolls`)
      mongoUser.setRolls(user, 6)
      break

      // %rc - reset claims
    case 'rc':
      rutil.warn(`Resetting ${user} to 2 claims`)
      mongoUser.setClaims(user, 2)
      break

      // %msg
    case 'msg':
      (color => {
        embed = new MessageEmbed()
          .setTitle('Artemis')
          .setColor(color)
          .setDescription('uwu kawaiiiii') // this is mega cringe.
          .setImage('http://puzzledragonx.com/en/img/monster/MONS_571.jpg')
        msg.channel.send(embed)
      })(Math.floor(Math.random() * 16777215).toString(16))
      break

       // DEBUG ========================================
  }
}

/**
 * Print the available REMi commands to user in Discord.
 * @param {parameter} msg User command and argument(s).
 */
function help ({ channel }) {
  channel.send(`**%roll** - roll for a monster!
**%help** - list commands
**%monbox** - print your monster box
**%myrolls** - print your rolls.
**%myclaims** - print your claims.
__***FAQ***__
You have **60** seconds to claim a monster from when it is rolled.
You may roll up to **6** times every **45** minutes
You may claim up to **2** monsters every **45** minutes`)
}

/**
 * Roll a monster for the user. First check that the user has
 * enough rolls. If this is the user's first roll (originally
 * had 6) make sure to record the time at which this happened
 * for refresh timer later. If the user has enough rolls, call
 * the roll function and return the monster's name. Also decrement
 * number of rolls if eligible.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function roll (user, msg) {
  mongoUser.checkRolls(user).then((numRolls) => {
    if (numRolls === 0) {
      // print how long user has to wait before rolling again
      msg.channel.send(`**${user}** has no rolls left!`)
      const rollNow = new Date()
      mongoUser.getRollTimestamp(user).then((rollTime) => {
        ffLater = new Date(rollTime.getTime() + 45 * 60000)
        timeDiff = (ffLater > rollNow) ? ffLater - rollNow : 0
        msg.channel.send(`Need to wait ${rutil.printTimeStamp(timeDiff)} for rolls to reset`)
      })
    } else {
      if (numRolls === 6) {
        // add timestamp for the first roll
        mongoUser.addRollTimestamp(user)
      }

      // roll for monster
      const roll = monster.rollMonster()
      mongoUser.addRollToBuffer(user, roll).then((claimId) => {
        rutil.clog(`${user} rolled ${roll.name} with active rolled ID ${claimId}`)

        // create embed message to display roll to chat
        randomColour = Math.floor(Math.random() * 16777215).toString(16)
        embed = new MessageEmbed()
          .setTitle(roll.name)
          .setColor(randomColour)
          .setDescription('Claim with :heart:')
          .setImage(roll.url)
          .setFooter(`${user} has ${numRolls - 1} roll(s) remaining.`)
        msg.channel.send(embed)

        // decrement number of rolls user has left
        mongoUser.setRolls(user, numRolls - 1)
      })
    }
  })
}

/**
 * Allow a user to claim a rolled monster and put it in their monster box. Check
 * That the user has enough claims first and also that the given name
 * is valid.
 * @param {string} user Username for user requesting info.
 * @param {parameter} args Name for a rolled monster.
 * @param {parameter} msg User command and argument(s).
 */
function claim (user, args, msg) {
  mongoUser.checkClaims(user).then((numClaims) => {
    // check if user has enough claims
    if (numClaims === 0) {
      msg.channel.send(`**${user}** has no claims left!`)
      const claimNow = new Date()
      mongoUser.getClaimTimestamp(user).then((claimTime) => {
        ffLater = new Date(claimTime.getTime() + (45 * 60000))
        timeDiff = (ffLater > claimNow) ? ffLater - claimNow : 0
        msg.channel.send(`Need to wait ${rutil.printTimeStamp(timeDiff)} for claims to reset`)
      })
    } else {
      if (numClaims === 2) {
        // record the time for the user's first claim
        mongoUser.addClaimTimestamp(user)
      }

      rutil.clog('User has enough claims')
      mongoUser.claimMonster(user, args).then((claimed) => {
        if (claimed.toString() === 'FAILED') {
          rutil.mlog(`CLAIM ERROR! ${args} not found in 'rolled' buffer.`)
          return
        }
        msg.channel.send(`**${user}** claimed **${claimed.toString()}**!
        you have **${numClaims - 1}** claim(s) remaining.`)
        rutil.clog(`${user} claimed ${claimed}`)

        // update user's remaining claims
        mongoUser.setClaims(user, numClaims - 1)
      })
    }
  })
}

/**
 * Allow a user to claim a rolled monster and put it in their monster box. Check
 * That the user has enough claims first and also that the claim ID
 * is valid.
 * @param {string} user Username for user requesting info.
 * @param {parameter} args Claim ID for a rolled monster.
 * @param {parameter} msg User command and argument(s).
 */
function claimid (user, args, msg) {
  mongoUser.checkClaims(user).then((numClaims) => {
    // check if user has enough claims
    if (numClaims === 0) {
      msg.channel.send(`**${user}** has no claims left!`)
      const claimNow = new Date()
      mongoUser.getClaimTimestamp(user).then((claimTime) => {
        ffLater = new Date(claimTime.getTime() + 45 * 60000)
        timeDiff = (ffLater > claimNow) ? ffLater - claimNow : 0
        msg.channel.send(`Need to wait ${rutil.printTimeStamp(timeDiff)} for claims to reset`)
      })
    } else {
      if (numClaims === 2) {
        // record the time for the user's first claim
        mongoUser.addClaimTimestamp(user)
      }

      rutil.clog('User has enough claims')
      mongoUser.claimMonsterById(user, args).then((claimed) => {
        if (claimed.toString() === 'FAILED') {
          msg.channel.send(`**__Error!__** ID ${args} is not a valid ID.`)
        } else {
          msg.channel.send(`**${user}** claimed **${claimed.toString()}**!
          you have **${numClaims - 1}** claim(s) remaining.`)
          rutil.clog(`${user} claimed ${claimed}`)
        }

        // update user's remaining claims
        mongoUser.setClaims(user, numClaims - 1)
      })
    }
  })
}

/**
 * Print a user's monster box to the Discord chat.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function monbox (user, msg) {
  mongoUser.printMonBox(user).then((monBox) => {
    msg.channel.send(`**${user}'s** monster box:
    ${rutil.monPrint(monBox)}`)
  })
}

/**
 * Let users check how many rolls they have. If they have 0, print
 * how much time left until their number of rolls resets to 6.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function myrolls (user, msg) {
  mongoUser.checkRolls(user).then((rolls) => {
    msg.channel.send(`**${user}** you currently have **${rolls}** rolls`)
    if (rolls === 0) {
      now = new Date()
      mongoUser.getRollTimestamp(user).then((rollTime) => {
        ffLater = new Date(rollTime.getTime() + 45 * 60000)
        timeDiff = ffLater - now
        msg.channel.send(`Wait ${rutil.printTimeStamp(timeDiff)} for rolls to refresh.`)
      })
    }
  })
}

/**
 * Let users check how many claims they have. If they have 0, print
 * how much time left until their number of claims resets to 2.
 * @param {string} user Username for user requesting info.
 * @param {parameter} msg User command and argument(s).
 */
function myclaims (user, msg) {
  mongoUser.checkClaims(user).then((claims) => {
    msg.channel.send(`**${user}** you currently have **${claims}** claims`)
    if (claims === 0) {
      now = new Date()
      mongoUser.getClaimTimestamp(user).then((claimTime) => {
        ffLater = new Date(claimTime.getTime() + 45 * 60000)
        timeDiff = ffLater - now
        msg.channel.send(`Wait ${rutil.printTimeStamp(timeDiff)} for claims to refresh.`)
      })
    }
  })
}
