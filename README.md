# REMi
Discord bot to emulate the Rare Egg Machine gacha from mobile game Puzzle & Dragons.  

Run with:  
```
$ npm install
```
and  
```
$ node remi/remi.js
```
  
    
 *Optionally run without database with*
 ```
 $ node remi/remi.js debug
 ```

## Cmds (WIP)

**%roll** - roll for a monster!  
**%monbox** - print monster box of collected monsters  
**%myrolls** - see how many rolls you have left  
**%myclaims** - see how many claims you have left  
**%help** - list all commands  

## Files
remi/ - main driver code  
monsters/ - <key, value> pairs of URLs and monsters scraped with PADx scraper loaded in when running  
resources/ - misc. folder for other REMi resources  
deprecated/ - older files used for testing  
Dashboard/ - front-end dashboard for users to view their monsters in a browser (WIP 06/20)

