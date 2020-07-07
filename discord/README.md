# REMi
API server for a Discord bot to emulate the Rare Egg Machine gacha from the mobile game Puzzle & Dragons.  

## Setup 
To install dependencies run `npm install` at the root of this repository.

To deploy the API server, use the command `npm run deploy`. Alternatively, deploy the server without access to the database using `npm run debug`. Lastly, deploy the server given a secure ngrok link in a `dbauth.json` "uri" field by using `npm run deploy pemi`.

To lint the codebase before contributing, use the command `npm run lint`. To force rewrite files to match lint specifications, use the command `npm run clean`.

## Supported Commands (WIP)

**%roll** - roll for a monster!  
**%monbox** - print monster box of collected monsters  
**%myrolls** - see how many rolls you have left  
**%myclaims** - see how many claims you have left  
**%help** - list all commands  

## Repository Structure
remi/ - main driver code  
monsters/ - <key, value> pairs of URLs and monsters scraped with PADx scraper which is loaded on runtime.
resources/ - misc. folder for other REMi resources  
deprecated/ - older files used for testing  
Dashboard/ - front-end dashboard for users to view their monsters in a browser (WIP 06/20)
