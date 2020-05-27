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
    addClaimTimestamp,
    addRollTimestamp,
    addRollToBuffer,
    checkUser,
    checkRolls,
    checkClaims,
    claimMonster,
    claimMonsterById,
    connectDB,
    getClaimTimestamp,
    getRollTimestamp,
    printCollections,
    printMonBox,
    printRolled,
    printUsers,
    setClaims,
    setRolls,
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

        // await db.collection("users").deleteMany();

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
 * @param {string} user Username for user requesting info
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

function setRolls(user, numRolls) {
    rutil.log(`Setting ${user}'s number of rolls to ${numRolls}`);
    const users = db.collection("users");
    return users.updateOne({"username": user}, {$set: {"numRolls": numRolls}});
}

/**
 * Allow the user to check how many claims they currently
 * have. This function simply queries the numClaims field in
 * remiDB.users
 * @param {string} user Username for user requesting info.
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
 * Set the user's number of claims to the specified amount.
 * @param {string} user Username for user requesting info.
 * @param {int} numClaims Number of claims to set for the user.
 */
function setClaims(user, numClaims) {
    rutil.log(`Setting ${user}'s claims to ${numClaims}`);
    const users = db.collection("users");
    return users.updateOne({"username": user}, {$set: {"numClaims" : numClaims}});
}

/**
 * Computes time differential between given time and right now
 * to see if forty five minutes or more have passed.
 * @param {Date} time given UTC time 
 * @return {bool} true if 45 minutes have passed, false otherwise
 */
function timeToReset(time) {
    const now = new Date();
    let diff = now - time;
    const hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;
    const mm = Math.floor(diff / 1000 / 60);
    return (hh > 1 || mm >= 45) ? true : false;
}

/**
 * Check if the user executing a cmd already exists in the
 * users collection in the DB. If not, create an entry. This function
 * is not asynchronous because we need to verify user exists in DB
 * before doing any other operations
 * @param {string} user Username for user requesting info
 */
function checkUser(user) {
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
                "firstRollTime": "",
                "firstClaimTime": "",
                "monPts": 0,
                "monBox": [],
            }).then((result) => {
                rutil.mlog(`Sucessfully inserted ${result} entry for ${user}`);
            });
            
        } else {
            rutil.mlog (`[CheckUser] User ${user} already in ${db.databaseName}`);
            
            // reset user rolls to 10 after 45 minutes after their first roll
            getRollTimestamp(user).then((firstRollTime) => {
                if (timeToReset(firstRollTime) == true) {
                    setRolls(user, 10);
                    rutil.mlog(`Resetting ${user}'s rolls to 10`);
                }
            });

            // reset user claims to 3 after 45 minutes after their first claim
            getClaimTimestamp(user).then((firstClaimTime) => {
                if (timeToReset(firstClaimTime) == true) {
                    setClaims(user, 3);
                    rutil.mlog(`Resetting ${user}'s claims to 3`);
                }
            });
        }
    });
}

/**
 * This monster allows the user executing this function to claim
 * the specified monster and add it into their collection. This will
 * update that user's entry in the users collection in the database.
 * @param {string} user Username for user requesting info
 * @param {string} name Name of the monster to claim
 */
async function claimMonster(user, name) {

}

/**
 * This allows the user executing this function to claim the
 * specified monster by ID and add it into their collection. This will
 * update that user's entry in the users collection in the database.
 * @param {string} user Username for user requesting info
 * @param {string} name Name of the monster to claim
 */
function claimMonsterById(user, id) {
    const rolled = db.collection("rolled");

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
            return result.monName;
        }
    });
}

/**
 * Send back a user's claimed monsters, their monster box.
 * @param {string} user Username for user requesting info
 */
function printMonBox(user) {
    const users = db.collection("users");

    return users.findOne({"username": user}).then((userEntry) => {
        return userEntry.monBox;
    });
}

/**
 * Add Monster into a user's monster box (monBox) list in users collection.
 * @param {string} user Username for user requesting info
 * @param {string} monName 
 */
async function addMonsterToBoxById(user, monName) {
    const users = db.collection("users");

    // add specified monster to users's monster box
    await users.updateOne({"username": user}, {$addToSet: {monBox: monName.toString()}});
    rutil.mlog(`Successfully inserted ${monName} in ${user}'s monter box`);
}

/**
 * Add timestamp to user when they use their first claim
 * @param {string} user 
 */
async function addClaimTimestamp(user) {
    const users = db.collection("users");

    await users.updateOne({"username": user}, {$set: {"firstClaimTime": new Date()}});
}

/**
 * Get the timestamp from when the user used their first claim.
 * @param {string} user Username for user requesting info
 */
function getClaimTimestamp(user) {
    const users = db.collection("users");

    // return firstClaimTime field for specified user
    return users.findOne({"username": user}).then((userEntry) => {
        return userEntry.firstClaimTime;
    });
}

/**
 * Add timestamp to user entry when they use their first roll.
 * @param {string} user Username for user requesting info
 */
async function addRollTimestamp(user) {
    const users = db.collection("users");

    // add timestamp of user's first roll below max amount
    await users.updateOne({"username": user}, {"$set": {"firstRollTime": new Date()}});
}

/**
 * Get the timestamp from when the user used their first roll.
 * @param {string} user Username for user requesting info
 */
function getRollTimestamp(user) {
    const users = db.collection("users");

    // return firstRollTime field for specified user
    return users.findOne({"username": user}).then((userEntry) => {
        return userEntry.firstRollTime;
    });
}

/**
 * Add a rolled mosnter to the active "rolled" buffer/collection. This
 * lets users have the oppurtunity to choose between rolls before
 * claiming a subset of them.
 * @param {string} name Monster name
 * @param {string} url Monster image URL
 */
async function addRollToBuffer(name, url) {
    const rolled = db.collection("rolled");
    const currTime = new Date();
    await rolled.insertOne({
        "claimId": claimId.toString(),
        "monName": name,
        "monUrl": url,
        "rollTime": currTime,
    })
    rutil.mlog(`${name} successfully added to rolled buffer with ID ${claimId}`);
    
    // return ID and update to next unique ID 
    const oldClaimId = claimId;
    claimId = (claimId + 1) % 900;
    return oldClaimId;
}