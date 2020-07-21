// mongoActions.js
// ===============
const rutil = require('./rutil')
const mongoUtil = require('./mongoUtil')

/**
 * Add a monster to a user's monster box. This assumes that the user does
 * not yet have this monster, and so a new entry is created in their monster
 * box array.
 * @param {string} user Username for user adding monster to box
 * @param {string} monster Name of the monster the user wishes to add
 */
async function add (user, monster) {
  const users = mongoUtil.getDb().collection('users')
  const entry = { name: monster.toString(), qty: 1 }

  // add specified monster to users's monster box
  try {
    await users.updateOne({ username: user }, { $addToSet: { monBox: entry } })
    rutil.mlog(`Successfully inserted ${monster.toString()} in ${user}'s monster box`)
  } catch (ex) {
    rutil.err(ex)
  }
}

/**
 * Search a user's monster box to see if they have the spcecified monster. Returns
 * null if not found and the result { name: , qty: } if found.
 * @param {string} user Username for user adding monster to box
 * @param {string} monster Name of the monster the user wishes to search
 */
async function find (user, monster) {
  const users = mongoUtil.getDb().collection('users')
  const query = { username: user, 'monBox.name': monster, 'monBox.qty': { $gte: 0 } }

  return users.findOne(query).then((result) => {
    if (result == null) {
      rutil.err(`${monster} was not found`)
      return null
    } else {
      const monsterRes = result.monBox.find(monName => monName.name === monster)
      rutil.log(`Found monster ${monsterRes}`)
      return monsterRes
    }
  })
}

/**
 * Update a user's monster box to change the quantity of a specified monster. This
 * function can either increment or decrement the quantity depending on the input parameter
 * inc.
 * @param {string} user Username for user adding monster to box
 * @param {string} monster Name of the monster the user wishes to update
 * @param {bool} inc 1 to increment, 0 to decrement
 */
async function update (user, monster, inc) {
  const users = mongoUtil.getDb().collection('users')
  const query = { username: user, 'monBox.name': monster }
  const updateQuery = (inc) ? { $inc: { 'monBox.$.qty': 1 } } : { $inc: { 'monBox.$.qty': -1 } }

  try {
    await users.updateOne(query, updateQuery)
    rutil.mlog(`Updated qty for ${monster} by ${((inc) ? 1 : -1)} in ${user}'s monster box`)
  } catch (ex) {
    rutil.err(ex)
  }
}

/**
 * Remove a specified monster from a user's monster box.
 * @param {string} user Username for user adding monster to box
 * @param {string} monster Name of the monster the user wishes to delete
 */
async function remove (user, monster) {
  const users = mongoUtil.getDb().collection('users')
  const query = { username: user }
  console.log(user)
  const deleteQuery = { $pull: { monBox: { name: monster } } }

  try {
    users.updateOne(query, deleteQuery)
  } catch (ex) {
    rutil.err(ex)
  }
}

module.exports = {
  add,
  find,
  update,
  remove
}
