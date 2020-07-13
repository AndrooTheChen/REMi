// mongoActions.js
// ===============
const rutil = require('./rutil')
const mongoUtil = require('./mongoUtil')

async function add (user, monster) {
    const users = mongoUtil.getDb().collection('users')
    const entry = {name: monster.toString(), qty: 1}

    // add specified monster to users's monster box
    try{
       users.updateOne({ username: user }, { $addToSet: { monBox: entry } })
      rutil.mlog(`Successfully inserted ${monster.toString()} in ${user}'s monster box`) 
    } catch (ex) {
      rutil.err(ex)
    }
  }
  
async function find (user, monster) {
    const users = mongoUtil.getDb().collection('users')
    const query = { username: user, "monBox.name": monster, "monBox.qty": {$gte: 0}}

    return users.findOne(query).then((result) => {
      if (result == null) {
        rutil.err(`${monster} was not found`)
      } else {
        monster_res = result.monBox.find(monName => monName.name === monster)
        rutil.log(`Found monster ${monster_res}`)
        return monster_res
      }
    })
}

async function update (user, monster, inc) {
  const users = mongoUtil.getDb().collection('users')
  const query = { username: user, "monBox.name": monster }
  const update_query = (inc) ? { $inc: {"monBox.$.qty": 1} } : { $inc: {"monBox.$.qty": -1} }

  try {
    users.updateOne(query, update_query)
  } catch(ex) {
    rutil.err(ex)
  }
}
  
async function remove (user, monster) {
    const users = mongoUtil.getDb().collection('users')
    const query = { username: user }
    console.log(user)
    const delete_query = { $pull: { monBox: { name: monster } } }
  
    try {
      users.updateOne(query, delete_query)
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