# UTSUKUSHI BOT (Discord-Bot)
![](https://img.shields.io/badge/Discord%20JS-14.9-blueviolet)
![](https://img.shields.io/badge/Version-1.2.1-success)

![](https://img.shields.io/badge/Node.js-43853D?&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
![](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

Discord Bot for my private Discord Server & friends server.

![](https://img.shields.io/badge/JS-v1.0.0-323330?logo=javascript&logoColor=F7DF1E)
![](https://img.shields.io/badge/TS-v1.1.0+-323330?logo=typescript&logoColor=007ACC)

## Dependency
- **[@Discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)** : 0.16.0       # Manage Voice Channel Connection and Audio Player
- **[@distube/ytdl-core](https://www.npmjs.com/package/@distube/ytdl-core)** : 4.11.8   # Youtube Downloader
- **[Axios](https://www.npmjs.com/package/axios)** : 0.27.2                             # Http Requests
- **[Discord.js](https://www.npmjs.com/package/discord.js)** : 14.9.0                   # Discord API
- **[Dotenv](https://www.npmjs.com/package/dotenv)** : 16.0.1                           # Manage Environments Variables
- **[Staticmaps](https://www.npmjs.com/package/staticmaps)** : 1.10.0                   # Get Static Map Images
- **[Ytsr](https://www.npmjs.com/package/ytsr)** : 3.8.0                                # Youtube Search Service

## Installation

1. Clone projet : `git clone https://github.com/DRACOX2500/Discord-Bot.git`

2. Install / Update packages manager  
   - Install **NodeJS** latest LTS version (*current : 18.15.0*)
   - Install / Update **NPM** : `npm i -g npm@<latest-version>` (*current 9.6.4*)
   - *Only Linux* : `apt install libtool` 

3. Install dependencies
   - Execute following command : `npm i`
   - Install TypeScript & TypeScriptPath (Global) : `npm i -g typescript tspath`
   - If an **Opus error** is returned, try to remone project directory and reclone project

4. Environment Variables
   - Copy or Rename `.env.example` into `.env`
   - Complete the *.env file* with your values

5. Start Utsukushi Project
   - Build : `npm run build`
   - Start : `npm start`
   - Build + Start : `npm restart`

![](./docs/img/start.png)

## Interaction
![](https://img.shields.io/badge/Slash_Commands-17-success)
![](https://img.shields.io/badge/Context_Menus-3-success)

### Slash Commands

Status : 
   - ✅ stable
   - 🧪 experimental
   - ❌ deprecated
   - 💀 deleted

|              **Name**              | **Description**                                                                                                                                                                                                                       | **Permission** | **DM** |       **status**       |
|:----------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|:------:|:----------------------:|
|            /big-burger             | Return a random burger picture                                                                                                                                                                                                        |      _No_      |   ✅    |  [💀](# "deleted")   |
|   [⭐](# "New")<br>/bot activity    | Set Utsukushi activity, Select activity type : <br> Play, Listen, Stream, Competing, Watch <br> And Enter an activity message                                                                                                         |      _No_      |   ✅    |    [✅](# "stable")     |
|    [⭐](# "New")<br>/bot status     | Set Utsukushi status : <br> Online, Idle, Do not Disturb, Invisible                                                                                                                                                                   |      _No_      |   ✅    |    [✅](# "stable")     |
|     [✨](# "Update")<br>/cache      | Manage your cache in Utsukushi Database :<br> - Delete: delete all your data in Utsukushi database<br>- Show: Utsukushi sends you your data in DM                                                                                     |      _No_      |   ✅    |    [✅](# "stable")     |
|               /fuel                | (Only for france - Governmental API) <br>Search fuel data (Address, Services, Updated Date, Fuel Cost, City, Department, Region) map include !                                                                                        |      _No_      |   ✅    |    [✅](# "stable")     |
|                /git                | Return Utsukushi Bot Github Repo                                                                                                                                                                                                      |      _No_      |   ✅    |    [✅](# "stable")     |
|       [⭐](# "New")<br>/guild       | Return Guild information (Created At, Joined At, Member Count, Booster Count, Locale, Emojis, Stickers, Roles, Banned Users)                                                                                                          |      _No_      |   ❌    |    [✅](# "stable")     |
| [⭐](# "New")<br>/guild-share-emoji | Authorize the guild to share emojis with Utsukushi and other guild                                                                                                                                                                    |  ManageGuild   |   ❌    |    [✅](# "stable")     |
|      [⭐](# "New")<br>/locale       | Change the local language of your guild                                                                                                                                                                                               |  ManageGuild   |   ❌    |    [✅](# "stable")     |
|     [⭐](# "New")<br>/notify on     | Choose a channel to notify when someone connects to a voice channel                                                                                                                                                                   |  ManageGuild   |   ❌    |    [✅](# "stable")     |
|    [⭐](# "New")<br>/notify off     | Disable notify system                                                                                                                                                                                                                 |  ManageGuild   |   ❌    |    [✅](# "stable")     |
|               /ping                | 🤖 All bots started like this (Historic Command)                                                                                                                                                                                      |      _No_      |   ✅    |    [✅](# "stable")     |
|      [✨](# "Update")<br>/play      | Play a music in voice channel, By default, plays the last music played (You can manage music with embed & buttons). <br>Search the music by keywords or YouTube URL, The keywords will be saved in the database and can be used later |      _No_      |   ❌    | [🧪](# "experimental") |
|   [⭐](# "New")<br>/play-together   | Start a Discord Activity in voice Channel                                                                                                                                                                                             |      _No_      |   ❌    |  [💀](# "delete")   |
| [⭐](# "New")<br>/soundeffect play  | Play sound effect in voice channel                                                                                                                                                                                                    |      _No_      |   ❌    |    [✅](# "stable")     |
|  [⭐](# "New")<br>/soundeffect add  | Add sound effect in Utsukushi Database (30sec max only)                                                                                                                                                                               |      _No_      |   ❌    |    [✅](# "stable")     |
|   [⭐](# "New")<br>/speak-as-bot    | Send a message as bot (attachment available)                                                                                                                                                                                          |      _No_      |   ✅    |    [✅](# "stable")     |


More slash command details available in **[Commands.md](./docs/commands.md)**

### Context Menus

#### What is a context menu ?

*"Context Menus are application commands which appear when right-clicking or tapping a user or a message, in the Apps submenu."*

source: [discordjs.guide](https://discordjs.guide/interactions/context-menus.html)

Status :
- ✅ stable
- 🧪 experimental
- ❌ deprecated
- 💀 deleted

|           **Name**           | **Description**                                                                                                                                                | **Permission** | **DM** |       **status**       |
|:----------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------:|:------:|:----------------------:|
|      Delete Up To This       | Select a message, right click and select this options to delete all messages until selected message (selected message include) ![](./docs/img/ContextMenu.png) | ManageMessages |   ✅    |    [✅](# "stable")     |
| [⭐](# "New")<br>React As Bot | Use the Utsukushi Emoji database to react to a message.                                                                                                        |      _No_      |   ✅    |    [✅](# "stable")     |
| [⭐](# "New")<br>Reply As Bot | Reply to a message as Utsukushi Bot                                                                                                                            |      _No_      |   ✅    | [🧪](# "experimental") |


## CI

Continious Integration with [SonarCloud](https://sonarcloud.io/) !

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DRACOX2500_Discord-Bot&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DRACOX2500_Discord-Bot)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DRACOX2500_Discord-Bot&metric=bugs)](https://sonarcloud.io/summary/new_code?id=DRACOX2500_Discord-Bot)