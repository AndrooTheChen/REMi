// mongoUsers.js
// =============
// const async = require ("async");

module.exports = {
    checkUser,
    claimMonster,
    connectDB,
}

async function connectDB(mongo_client) {
    try {
        await mongo_client.connect({
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        
        // query for collection
        const db = mongo_client.db("remiDB");
        console.log(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");
        return `success`;
    } catch (ex) {
        console.log(`Connection failed! Error: ${ex}`);
        return `fail`;
    } finally {
        console.log(`Connection attempt finished.`);
    }
}

function insertUser(users, user) {
    const insertCursor = users.insertOne({
        "username": user,
        "numRolls": 10,
        "numClaims": 3,
        "lastRollTime": "",
        "lastClaimTime": "",
        "monPts": 0,
        "rolls": [],
    });
    console.log(`Sucessfully inserted ${insertCursor.insertedCount} entry for ${user}`);
}

/**
 * Check if the user executing a cmd already exists in the
 * users collection in the DB. If not, create an entry.
 * @param {string} user Username of user calling function
 */
async function checkUser(user) {
    // connect to DB
    // const {MongoClient} = require("mongodb");
    // const uri = "mongodb://localhost:27017";
    // const client = new MongoClient(uri);

    try {
        // await client.connect();

        // get collection
        const db = client.db("remiDB");
        console.log(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");

        // verify user exists in collection
        users.findOne({"username":user}, function(err, result){
            if (err || result == null) {
                // add new user to collection
                console.log(`${user} is not yet registered.`);
                const insertCursor = users.insertOne({
                    "username": user,
                    "numRolls": 10,
                    "numClaims": 3,
                    "lastRollTime": "",
                    "lastClaimTime": "",
                    "monPts": 0,
                    "rolls": [],
                });
                console.log(`Sucessfully inserted ${insertCursor.insertedCount} entry for ${user}`);
            }
        });
    } catch (ex) {
        console.log(`Connection failed! Error: ${ex}`);
    } finally {
        console.log(`Don't close TCP connection`);
        await client.close();
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