// rutil.js
// =======
module.exports = {
    mlog,
    log,
    warn,
    err,
};

/**
 * Get current time stamp.
 * @return {string} current time stamp in readable format
 */
function getTimeStamp() {
    const today = new Date();
    const date = (today.getUTCMonth() +  1) + '/' + today.getUTCDay() + '/' + today.getFullYear();
    const time = today.getUTCHours() + ':' + today.getUTCMinutes() + ':' + today.getUTCSeconds();
    return `${date} ${time}`;
}

/**
 * Log the given message with a time stamp to the console.
 * @param {string} msg Message to be logged
 */
function log(msg) {
    console.log(`[${getTimeStamp()} LOGGING] ${msg}`);
}

/**
 * Log the given message with a time stamp to the console. This
 * is used for MDB transactions
 * @param {string} msg Message to be logged
 */
function mlog(msg) {
    console.log(`[${getTimeStamp()} RemiDB LOGGING] ${msg}`);
}

/**
 * Log the given message with a time stamp to the console.
 * @param {string} msg Message to be logged
 */
function warn(msg) {
    console.log(`[${getTimeStamp()} WARNING] ${msg}`);
}

/**
 * Log the given message with a time stamp to the console.
 * @param {string} msg Message to be logged
 */
function err(msg) {
    console.log(`[${getTimeStamp()} ERROR] ${msg}`);
}