const { MongoClient } = require('mongodb')
const dbauth = require('./dbauth')
const rutil = require('./rutil')

let _db
let _client

module.exports = {

  /**
 * Connect to remiDB. This should be called in the beginning.
 * @return {string} Returns status as `success` or `fail`
 */
  connectToServer: (isRemote, callback) => {
    const connUri = (isRemote) ? dbauth.uri : 'mongodb://localhost:27017'
    _client = MongoClient.connect(connUri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }, (err, client) => {
      _db = client.db('remiDB')
      _client = client
      rutil.mlog(`Connected to database ${_db.databaseName}`)
      return callback(err)
    })
  },

  getDb: () => {
    return _db
  },

  closeDB: () => {
    _client.close()
  }

}
