# MatchUps

## About

 A Discord Bot that makes it easy to run coding cups on Codeforces. It  schedules matches for a single-elimination tournament. The bot has a  betting system also where players not in match can predict winner of  matches.

Matchups has set of sixteen commands, including those for :
 - bot setup
 - launch cups
 - generate rounds and matches
 - compare players
 - make bids 
 - observe ratings

</br>

 ## Usage
 
| Command | Sub Command | Description  
|-----------|:-----------:|-----------:|  
| ~help | | all commands that bot can read |
| ~setup |  | setup the server in the database |  
| ~handle *`<cf handle>`* |  | second line of text |
| ~cup | new | launch a new cup  |
| ~cup | start | start the cup |
| ~cup | add me | add yourself to the cups |
| ~cup | players | users currently in the cup |
| ~cup | reset | **[Access to Owner Only]** discards the current cup |
| ~show | users | macth info of all users |
| ~show | round | running round |
| ~show | match *`<PLAYER1>`* vs *`<PLAYER2>`*||
| ~bet | on *`<PLAYER> <AMOUNT>`*| place bet on a player |
| ~forcewin *`<PLAYER>`* | | **[Access to Owner Only]** set result of a match |

</br>

 ## Planned Features

 - [ ] Re-write & expand codebase
 - [ ] Visual and Graphical Stats of matches
 - [ ] Adding Elo Rating System for comparision
 - [ ] Logs of Completed Cups

</br>

 ## Run The Bot

To run MatchUps on your own server: 
 1. Clone this repo 
 2. Install dependencies with `npm install`
 3. Create a **.env** file at the root directory with keys and urls for following:

 ```shell
 DISCORD_TOKEN  = 
 MONGODB_URL    = 
 GUILD_OWNER_ID =  
 ``` 
 4. Run this `nodemon botserver` and MatchUps will be ready to host cups !!   


