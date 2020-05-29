// rutil.js
// ======
let module;

const hearts = new Set([`%E2%9D%A4%EF%B8%8F` /* :heart: */, 
                        `%E2%99%A5%EF%B8%8F` /* :hearts: */,
                        `%F0%9F%96%A4` /* :black_heart: */,
                        `%F0%9F%92%99` /* :blue_heart: */,
                        `%F0%9F%A4%8E` /* :brown_heart: */,
                        `%F0%9F%92%9A` /* :green_heart: */,
                        `%F0%9F%A7%A1` /* :orange_heart: */,
                        `%F0%9F%92%9C` /* :purple_heart: */,
                        `%F0%9F%92%9E` /* :revolving_heart: */,
                        `%F0%9F%92%96` /* :sparkling_heart: */,
                        `%F0%9F%92%95` /* :two_hearts: */,
                        `%F0%9F%A4%8D` /* :white_heart: */,
                        `%F0%9F%92%9B` /* :yellow_heart: */,
                        `%F0%9F%92%93` /* :heartbeat: */,
                        `%F0%9F%92%97` /* :heartpulse: */,]);

module.exports = {
    clog,
    err,
    log,
    monPrint,
    mlog,
    printTimeStamp,
    warn,
    "hearts": hearts,
};

/**
 * Convert date into readable format.
 * @param {Date} time 
 */
function printTimeStamp(time) {
    const hh = Math.floor(time / 1000 / 60 / 60);
    time -= hh * 1000 * 60 * 60;
    const mm = Math.floor(time / 1000 / 60);
    time -= mm * 1000 * 60;
    const ss = Math.floor(time / 1000);
    return `**${hh}** hrs **${mm}** min **${ss}** sec`;
}

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
 * Build the string to print a user's monster box.
 * @param {array} monBox List containing a user's monster box
 */
function monPrint(monBox) {
    let str = `\`\`\`\n`;

    monBox.forEach((monster) => {
        str = str + `${monster}\n`;
    })

    str = str + `\`\`\``;
    return str;
}

/**
 * Log the given message with a time stamp to the console.
 * @param {string} msg Message to be logged
 */
function log(msg) {
    console.log(`[${getTimeStamp()} REMi main LOGGING] ${msg}`);
}

/**
 * Log the given message with a time stamp to the console. This 
 * is used to log commands.
 * @param {string} msg Message to be logged
 */
function clog(msg) {
    console.log(`[${getTimeStamp()} CMD LOGGING] ${msg}`);
}

/**
 * Log the given message with a time stamp to the console. This
 * is used for MDB transactions.
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
