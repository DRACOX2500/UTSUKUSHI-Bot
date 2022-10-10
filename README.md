# UTSUKUSHI BOT (Discord-Bot)
![](https://img.shields.io/badge/Discord%20JS-14-blueviolet)
![](https://img.shields.io/badge/Version-1.2-success)

![](https://img.shields.io/badge/Node.js-43853D?&logo=node.js&logoColor=white)
![](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)
![](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

Discord Bot for my private Discord Server & friends server.

![](https://img.shields.io/badge/JS-v1.0.0-323330?logo=javascript&logoColor=F7DF1E)
![](https://img.shields.io/badge/TS-v1.1.0+-323330?logo=typescript&logoColor=007ACC)

## Dependency
- **[@Discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)** : 0.11.0       # Manage Voice Channel Connection and Audio Player
- **[@distube/ytdl-core](https://www.npmjs.com/package/@distube/ytdl-core)** : 4.11.1   # Youtube Downloader
- **[Axios](https://www.npmjs.com/package/axios)** : 0.27.2                             # Http Requests
- **[Discord.js](https://www.npmjs.com/package/discord.js)** : 14.3.0                   # Discord API
- **[Dotenv](https://www.npmjs.com/package/dotenv)** : 16.0.1                           # Manage Environments Variables
- **[Staticmaps](https://www.npmjs.com/package/staticmaps)** : 1.10.0                   # Get Static Map Images
- **[Ytsr](https://www.npmjs.com/package/ytsr)** : 3.8.0                                # Youtube Search Service

## Installation

1. Clone projet : `git clone https://github.com/DRACOX2500/Discord-Bot.git`

2. Install / Update packages manager  
- Install **NodeJS** latest LTS version (*current : 17.10.1*)
- Install / Update **NPM** : `npm i -g npm@<latest-version>` (*current 8.19.2*)
- *Only Linux* : `apt install libtool` 

3. Install dependencies
- Execute following command : `npm i`
- Install TypeScript (Global) : `npm i -g typescript`
- If an **Opus error** is returned, try to remone project directory and reclone project

4. Start Utsukushi Project
- Build : `npm run build`
- Start : `npm start`
- Build + Start : `npm restart`

![](./.github/readme/start.png)

## Interaction
![](https://img.shields.io/badge/Slash_Commands-13-success)
![](https://img.shields.io/badge/Context_Menus-1-success)

### Commands

Commands détails available in **[Commands.md](./.github/readme/commands.md)**

### Context Menus

#### What is a context menu ?

*"Context Menus are application commands which appear when right clicking or tapping a user or a message, in the Apps submenu."*

source: [discordjs.guide](https://discordjs.guide/interactions/context-menus.html)

#### Delete Up To This

![](./.github/readme/ContextMenu.png)

Select a message, right click and select this options to delete all messages until selected message (selected message include)

## CI

Continious Integration with [SonarCloud](https://sonarcloud.io/) !

[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=DRACOX2500_Discord-Bot&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=DRACOX2500_Discord-Bot)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=DRACOX2500_Discord-Bot&metric=bugs)](https://sonarcloud.io/summary/new_code?id=DRACOX2500_Discord-Bot)