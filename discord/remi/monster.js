// monster.js
// ==========
// for parsing text files
const readline = require('readline')
const fs = require('fs')

// store monsters in arrays
const threeStarDrops = []
const fourStarDrops = []
const fiveStarDrops = []
const fiveStarGods = []
const GFE = []

/**
 * Roll a monster.
 * @return {url, name} The key-value pair of the roll
 */
function rollMonster () {
  const tier = Math.floor(Math.random() * 100) + 1
  let drop

  if (tier <= 10) {
    // 10% chance for 3*
    drop = threeStarDrops[Math.floor(Math.random() * threeStarDrops.length)]
  } else if (tier > 10 && tier <= 45) {
    // 35% chance for 4* or 5* non-god
    drop = (Math.random() < 0.5) ? fourStarDrops[Math.floor(Math.random() * fourStarDrops.length)] : fiveStarDrops[Math.floor(Math.random() * fiveStarDrops.length)]
  } else if (tier > 45 && tier <= 90) {
    // 45% chance for 5* god
    drop = fiveStarGods[Math.floor(Math.random() * fiveStarGods.length)]
  } else {
    // 10% chance for GFE
    drop = GFE[Math.floor(Math.random() * GFE.length)]
  }
  const roll = {
    url: drop.url,
    name: drop.name,
    rarity: drop.rarity
  }

  return roll
}

// Read in the monsters, segregate, and store
const threeStarFile = 'monsters/three_star_drops.txt'
const fourStarFile = 'monsters/four_star_drops.txt'
const fiveStarFile = 'monsters/five_star_drops.txt'
const fiveStarGodsFile = 'monsters/five_star_gods.txt'
const GFEFile = 'monsters/GFE.txt'

const readThreeStar = readline.createInterface({
  input: fs.createReadStream(threeStarFile)
})

const readFourStar = readline.createInterface({
  input: fs.createReadStream(fourStarFile)
})
const readFiveStar = readline.createInterface({
  input: fs.createReadStream(fiveStarFile)
})
const readFiveStarGod = readline.createInterface({
  input: fs.createReadStream(fiveStarGodsFile)
})
const readGFE = readline.createInterface({
  input: fs.createReadStream(GFEFile)
})

readThreeStar.on('line', function (line) {
  const newline = line.split('@')
  const mon = {
    url: newline[0],
    name: newline[1],
    rarity: 'three-star'
  }
  threeStarDrops.push(mon)
})
readFourStar.on('line', function (line) {
  const newline = line.split('@')
  const mon = {
    url: newline[0],
    name: newline[1].toString().substr(1),
    rarity: 'four-star'
  }
  fourStarDrops.push(mon)
})
readFiveStar.on('line', function (line) {
  const newline = line.split('@')
  const mon = {
    url: newline[0],
    name: newline[1].toString().substr(1),
    rarity: 'five-star'
  }
  fiveStarDrops.push(mon)
})
readFiveStarGod.on('line', function (line) {
  const newline = line.split('@')
  const mon = {
    url: newline[0],
    name: newline[1].toString().substr(1),
    rarity: 'god'
  }
  fiveStarGods.push(mon)
})
readGFE.on('line', function (line) {
  const newline = line.split('@')
  const mon = {
    url: newline[0],
    name: newline[1].toString().substr(1),
    rarity: 'gfe'
  }
  GFE.push(mon)
})

module.exports = {
  rollMonster,
  threeStarDrops: threeStarDrops,
  fourStarDrops: fourStarDrops,
  fiveStarDrops: fiveStarDrops,
  fiveStarGods: fiveStarGods,
  GFE: GFE
}
