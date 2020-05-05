// mongoUsers.js
// =============
const rutil = require(`./rutil`);

// connect to DB
const {MongoClient} = require("mongodb");
const uri = "mongodb://localhost:27017";
const mongo_client = new MongoClient(uri, { useUnifiedTopology: true });
let db;
module.export = {"mongo_client": mongo_client};

// current claim ID cycles 0-999
let claimId = 0;

module.exports = {
    checkUser,
    checkRolls,
    checkClaims,
    claimMonster,
    claimMonsterById,
    connectDB,
    addRollToBuffer,
    printUsers,
    printRolled,
    printCollections,
    "mongo_client" : mongo_client,
}

/**
 * DEBUG
 * This function is for debugging only, just to print all
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
 * This function is for debugging only, just to print all
 * entries in the "users" collection in remiDB.
 */
function printUsers() {
    const db = mongo_client.db("remiDB");
    db.collection("users").find().toArray(function(err, docs) {
        console.log(JSON.stringify(docs));
    });
}

/**
 * DEBUG
 * This function is for debugging only, just to print all
 * entries in the "users" collection in remiDB.
 */
function printRolled() {
    const db = mongo_client.db("remiDB");
    db.collection("rolled").find().toArray(function(err, docs) {
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
        
        db = mongo_client.db("remiDB");
        rutil.mlog(`Connected to database ${db.databaseName}`);
        
        // make sure rolled buffer is clear on startup
        await db.collection("rolled").deleteMany();

        return `success`;
    } catch (ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
        return `fail`;
    }
}

/**
 * Allow the user to check how many rolls they currently
 * have. This function simply queries the numRolls field in
 * remiDB.users
 * @param {string} user Username of user calling function
 */
async function checkRolls(user) {
    rutil.mlog(`checking ${user}'s rolls`);
    try {
        const users = db.collection("users");
        const user_entry = await users.findOne({"username": user});
        return user_entry.numRolls;
    } catch(ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
    }
    rutil.mlog(`finished checking rolls`);
}

/**
 * Allow the user to check how many claims they currently
 * have. This function simply queries the numClaims field in
 * remiDB.users
 * @param {string} user Username of user calling function
 */
async function checkClaims(user) {
    rutil.mlog(`checking ${user}'s claims`);
    try {
        const users = db.collection("users");
        const user_entry = await users.findOne({"username": user});
        return user_entry.numClaims;
    } catch(ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
    }
    rutil.mlog(`finished checking claims`);
}

/**
 * Check if the user executing a cmd already exists in the
 * users collection in the DB. If not, create an entry. This function
 * is not asynchronous because we need to verify user exists in DB
 * before doing any other operations
 * @param {string} user Username of user calling function
 */
function checkUser(user) {
    try {
        // get collection
        const db = mongo_client.db("remiDB");
        rutil.mlog(`Connected to database ${db.databaseName}`);
        const users = db.collection("users");

        // verify user exists in collection
        users.findOne({"username":user}, function(err, result){
            if (err || result == null) {
                // add new user to collection
                rutil.mlog(`${user} is not yet registered.`);
                users.insertOne({
                    "username": user,
                    "numRolls": 10,
                    "numClaims": 3,
                    "lastRollTime": "",
                    "lastClaimTime": "",
                    "monPts": 0,
                    "monBox": [],
                }).then((result) => {
                    rutil.mlog(`Sucessfully inserted ${result} entry for ${user}`);
                });
                
            } else {
                rutil.mlog (`User ${user} already in ${db.databaseName}`);
            }
        });
    } catch (ex) {
        rutil.err(`Connection failed! Error: ${ex}`);
    } finally {
        rutil.mlog(`Don't close TCP connection`);
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
async function claimMonster(user, name) {

}

/**
 * This monster allows the user executing this function to claim
 * the specified monster by ID and add it into their collection. This will
 * update that user's entry in the users collection in the database.
 * @param {string} user Username of user calling function
 * @param {string} name Name of the monster to claim
 */
function claimMonsterById(user, id) {
    const rolled = db.collection("rolled");
    let output = 'init';

    // return a promise to search for desired monster in active rolled collection
    return rolled.findOne({"claimId": id.toString()}).then((result) => {
        if (result == null) {
            // error, user tried to claim invalid ID
            rutil.err(`${id} not found in 'rolled' collection`);
            rutil.mlog(`returning FAILED`);
            return `FAILED`;
        } else {
            // add monster to user's monster box in user collection
            addMonsterToBoxById(user, result.monName);

            // remove monster from active collection
            rolled.deleteOne({"claimId": id.toString()});
            rutil.mlog(`returning ${result.monName}`);
            return result.monName;
        }
    });
}

async function addMonsterToBoxById(user, monName) {
    const users = db.collection("users");

    // add specified monster to users's monster box
    await users.updateOne({"username": user}, {$addToSet: {monBox: monName.toString()}});
    rutil.mlog(`{Successfully inserted ${monName} in ${user}'s monter box}`);
}

async function addRollToBuffer(name, url) {
    const rolled = db.collection("rolled");
    const currTime = new Date();
    await rolled.insertOne({
        "claimId": claimId.toString(),
        "monName": name,
        "monUrl": url,
        "rollTime": currTime,
        "isClaimed": false,
    })
    rutil.mlog(`${name} successfully added to rolled buffer with ID ${claimId}`);
    
    // return ID and update to next unique ID 
    const oldClaimId = claimId;
    claimId = (claimId + 1) % 900;
    return oldClaimId;
}