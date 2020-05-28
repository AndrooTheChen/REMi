// monster.js
// ==========

// for parsing text files
const readline = require('readline');
const fs = require('fs');

// store monsters in arrays
const three_star_drops = [];
const four_star_drops = [];
const five_star_drops = [];
const five_star_gods = [];
const GFE = [];

/**
 * Roll a monster.
 * @return {url, name} The key-value pair of the roll
 */
function rollMonster() {
    tier = Math.floor(Math.random() * 100) + 1;
    let drop;

    if (tier <= 10) {
        drop = three_star_drops[Math.floor(Math.random() * three_star_drops.length)];
    } else if (tier > 10 && tier <= 45) {
        drop = four_star_drops[Math.floor(Math.random() * four_star_drops.length)];
    } else if (tier > 45 && tier <= 90) {
        drop = five_star_drops[Math.floor(Math.random() * five_star_drops.length)];
    } else {
        drop = GFE[Math.floor(Math.random() * GFE.length)];
    }
    let roll = {
        url: drop.url,
        name: drop.name,
        rarity: drop.rarity,
    };

    return roll;
}

// Read in the monsters, segregate, and store
// const monFile = `${process.env.WINHOME}Androo/bots/remy/monsters`;
const monFile = `${process.env.HOME}/Workspace/remi/monsters`;

const readThreeStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/three_star_drops.txt`)
});
const readFourStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/four_star_drops.txt`)
});
const readFiveStar = readline.createInterface({
    input: fs.createReadStream(`${monFile}/five_star_drops.txt`)
});
const readFiveStarGod = readline.createInterface({
    input: fs.createReadStream(`${monFile}/five_star_gods.txt`)
});
const readGFE= readline.createInterface({
    input: fs.createReadStream(`${monFile}/GFE.txt`)
});

readThreeStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1],
        rarity: "three-star",
    };
    three_star_drops.push(mon);
});
readFourStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1].toString().substr(1),
        rarity: "four-star",
    };
    four_star_drops.push(mon);
});
readFiveStar.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1].toString().substr(1),
        rarity: "five-star",
    };
    five_star_drops.push(mon);
});
readFiveStarGod.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1].toString().substr(1),
        rarity: "god",
    };
    five_star_gods.push(mon);
});
readGFE.on('line', function(line) {
    let newline = line.split('@');
    let mon = {
        url: newline[0],
        name: newline[1].toString().substr(1),
        rarity: "gfe",
    };
    GFE.push(mon);
});

module.exports = {
    rollMonster,
    "three_star_drops": three_star_drops,
    "four_star_drops": four_star_drops,
    "five_star_drops": five_star_drops,
    "five_star_gods": five_star_gods,
    "GFE": GFE,
};