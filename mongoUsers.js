// mongoUsers.js
// =============
const rutil = require(`./rutil`);

// connect to DB
const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const mongo_client = new MongoClient(uri, { useUnifiedTopology: true });
let db;
module.export = {"mongo_client": mongo_client};


module.exports = {
    checkUser,
    checkClaims,
    claimMonster,
    connectDB,
    printDB,
    printCollections,
    "mongo_client" : mongo_client,
}

/**
 * DEBUG
 * This function is for debuggin only, just to print all
 * collections in remiDB.
 */
function printCollections() {
    const db = mongo_client.db("remiDB");
    db.listCollections().toArray(function (err, results) {
        if (results.length == 0) console.log(`no collections`);
        else console.log(`printing collections`);
        console.log(JSON.stringify(results));
    });
}

/**
 * DEBUG
 * This function is for debuggign only, just to print all
 * entries in the "users" collection in remiDB.
 */
function printDB() {
    const db = mongo_client.db("remiDB");
    db.collection("users").find().toArray(function(err, docs) {
        console.log(JSON.stringify(docs));
    });
}

/**
 * Connect to remiDB. This should be called in the beginning.
 * @return {string} Returns status as `sucess` or `fail`
 */
async function connectDB() {
    try {
        await mongo_client.connect({
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        
        // query for collection
        db = mongo_client.db("remiDB");
        rutil.log(`Connected to database ${db.databaseName}`);
        // const users = db.collection("users");s
        return `success`;
    } catch (ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
        return `fail`;
    }
}

async function checkClaims(user) {
    rutil.log(`checking ${user}'s claims`);
    try {
        const users = db.collection("users");

        // users.findOne({"username":user},function (err, result) {
        //     if (err || result == null) {
        //         rutil.log(`found nothing: ${typeof result}`);
        //         return "USER_NOT_FOUND";
        //     }
        //     rutil.log(`${Object.getOwnPropertyNames(result)}`);
        //     rutil.log(`something found, returning ${typeof result}`);
        //     return JSON.stringify(result);
        // });

        const user_entry = await users.findOne({"username": user});
        rutil.log(`returning fields: ${Object.getOwnPropertyNames(user_entry)}`);
        rutil.log(`returning: ${user_entry.numRolls}`);
        return user_entry.numRolls;
    } catch(ex) {
        rutil.err(`Connection failed! Error: ${ex}`)
    }
    rutil.log(`finished checking claims`);
}

/**
 * Check if the user executing a cmd already exists in the
 * users collection in the DB. If not, create an entry.
 * @param {string} user Username of user calling function
 */
function checkUser(user) {
    try {
        // get collection
        const db = mongo_client.db("remiDB");
        rutil.log(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");

        // verify user exists in collection
        users.findOne({"username":user}, function(err, result){
            if (err || result == null) {
                // add new user to collection
                rutil.log(`${user} is not yet registered.`);
                const insertCursor = users.insertOne({
                    "username": user,
                    "numRolls": 10,
                    "numClaims": 3,
                    "lastRollTime": "",
                    "lastClaimTime": "",
                    "monPts": 0,
                    "rolls": [],
                });
                rutil.log(`Sucessfully inserted ${insertCursor.insertedCount} entry for ${user}`);
            } else {
                rutil.log (`User ${user} already in ${db.databaseName}`);
            }
        });
    } catch (ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
    } finally {
        rutil.log(`Don't close TCP connection`);
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