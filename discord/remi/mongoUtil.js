const { MongoClient } = require('mongodb')
const dbauth = require('./dbauth')
const rutil = require('./rutil')

let _db
let _client

module.exports = {

  connectToServer: (isRemote, callback) => {
    const conn_uri = (isRemote) ? dbauth.uri : "mongodb://localhost:27017"
    _client =  MongoClient.connect( conn_uri,  {
        useUnifiedTopology: true,
        useNewUrlParser: true
      }, (err, client) => {
      _db  = client.db('remiDB');
      _client = client
      rutil.mlog(`Connected to database ${_db.databaseName}`)
      return callback( err )
    })
  },

  getDb: () => {
    return _db
  },

  closeDB: () => {
      _client.close()
  }
  
}