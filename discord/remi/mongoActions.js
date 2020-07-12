// mongoActions.js
// ===============
const rutil = require('./rutil')
const mongoUsers = require('./mongoUsers')

// db = mongoUsers.mongo_client.db('remiDB')

// async function testAdd (user, monster) {
//     const users = db.collection('users')
  
//     // add specified monster to users's monster box
  
//     const entry = {name: monster.toString(), qty: 1}
//     await users.updateOne({ username: user }, { $addToSet: { monBox: entry } })
//     rutil.mlog(`Successfully inserted ${monster.toString()} in ${user}'s monster box`) 
//   }
  
// async function testFind(user, monster) {
//     const users = db.collection('users')
    
//     const query = { username: user, "monBox.name": monster, "monBox.qty": {$gte: 0}}
//     return users.findOne(query).then((result) => {
//       if (result == null) {
//         rutil.err(`${monster} was not found`)
//       } else {
//         console.log(result.monBox.find(monName => monName.name === monster))
//       }
//     })
// }
  
// async function testIncrement (user, monster) {
//     const users = db.collection('users')
//     const query = { username: user, "monBox.name": monster}
//     const update_query = { $inc: {"monBox.$.qty": 1} }
  
//     try {
//       users.updateOne(query, update_query)
//     } catch (ex) {
//       rutil.err(ex)
//     }
// }
  
// async function testDecrement (user, monster) {
//     const users = db.collection('users')
//     const query = { username: user, "monBox.name": monster }
//     const dec_query = { $inc: { "monBox.$.qty": -1 }}
  
//     try {
//       users.updateOne(query, dec_query)
//     } catch (ex) {
//       rutil.err(ex)
//     }
// }
  
// async function testDelete (user, monster) {
//     const users = db.collection('users')
//     const query = { username: user }
//     console.log(user)
//     const delete_query = { $pull: { monBox: { name: monster } } }
  
//     try {
//       users.updateOne(query, delete_query)
//     } catch (ex) {
//       rutil.err(ex)
//     }
// }

// module.exports = {
//     testAdd,
//     testFind,
//     testIncrement,
//     testDecrement,
//     testDelete,
// }