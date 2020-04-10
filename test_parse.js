const readline = require('readline');
const fs = require('fs');

const mon_db = [];

const readInterface = readline.createInterface({
    input: fs.createReadStream(`${process.env.WINHOME}Androo/bots/remy/rem_urls.txt`)
});

readInterface.on('line', function(line) {
    let newline = line.split('@')
    let mon = {
        name: newline[0],
        url: newline[1]
    }
    mon_db.push(mon);
    console.log(`${mon.name}, ${mon.url}`);
    // for (let entry in mon_db)
    // {
    //     console.log(`${entry.name} links to ${entry.url}`)
    // }
});