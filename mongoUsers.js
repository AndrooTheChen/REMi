// mongoUsers.js
// =============
const util = require(`./util`);

// connect to DB
const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const mongo_client = new MongoClient(uri, { useUnifiedTopology: true });
module.export = {"mongo_client": mongo_client};

module.exports = {
    checkUser,
    claimMonster,
    connectDB,
    printDB,
    printCollections,
    "mongo_client" : mongo_client,
}

function printCollections() {
    const db = mongo_client.db("remiDB");
    db.listCollections().toArray(function (err, results) {
        if (results.length == 0) console.log(`no collections`);
        else console.log(`printing collections`);
        console.log(JSON.stringify(results));
    });
}

function printDB() {
    const db = mongo_client.db("remiDB");
    db.collection("users").find().toArray(function(err, docs) {
        console.log(JSON.stringify(docs));
    });
}

async function connectDB() {
    try {
        await mongo_client.connect({
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        
        // query for collection
        const db = mongo_client.db("remiDB");
        util.log(`Connected to database ${db.databaseName}`);
        // const users = db.collection("users");s
        return `success`;
    } catch (ex) {
        util.err(`Connection failed! Error: ${ex}`);
        return `fail`;
    } finally {
        util.log(`Connection attempt finished.`);
    }
}

/**
 * Check if the user executing a cmd already exists in the
 * users collection in the DB. If not, create an entry.
 * @param {string} user Username of user calling function
 */
async function checkUser(user) {
    try {
        // get collection
        const db = mongo_client.db("remiDB");
        util.log(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");

        // verify user exists in collection
        users.findOne({"username":user}, function(err, result){
            if (err || result == null) {
                // add new user to collection
                util.log(`${user} is not yet registered.`);
                const insertCursor = users.insertOne({
                    "username": user,
                    "numRolls": 10,
                    "numClaims": 3,
                    "lastRollTime": "",
                    "lastClaimTime": "",
                    "monPts": 0,
                    "rolls": [],
                });
                util.log(`Sucessfully inserted ${insertCursor.insertedCount} entry for ${user}`);
            } else {
                util.log (`user ${user} already in ${db.databaseName}`);
            }
        });
    } catch (ex) {
        util.err(`Connection failed! Error: ${ex}`);
    } finally {
        util.log(`Don't close TCP connection`);
        // await mongo_client.close();
    }
}

/**
 * This monster allows the user executing this function to claim
 * the specified monster and add it into their collection. This will
 * update that user's entry in the users collection in the database.
 * @param {string} user Username of user calling function
 * @param {string} name Name of the monster to claim
 */
function claimMonster(user, name) {

}