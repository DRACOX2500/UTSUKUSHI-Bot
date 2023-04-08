# UTSUKUSHI BOT COMMANDS

|  **Total**  | **Production** |  **Deleted**  |
|:-----------:|:--------------:|:-------------:|
|     18      |       15       |       3       |


## Command 1.0.0

### **/ping** ![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow)

|                 |                      |
|-----------------|----------------------|
| **Version**     | 1.1.0                |
| **Description** | get pong information |


![](./img/ping.png)

\* *this image is a screenshot in dev version and my connection is really bad*

\* *In prod version, UTSUKUSHI has **100Go/s**, so if the color is yellow or red it's you*

- Pong data + Web Socket connection

- Color : 
     - Green = pong < 500ms
     - Yellow = pong > 500ms and pong < 750ms
     - Red = pong > 750ms

### **/git** 
![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow)

|                 |                         |
|-----------------|-------------------------|
| **Version**     | 1.0.0                   |
| **Description** | get the URL GitHub repo |

### **/big-burger** 
![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow) ![](https://img.shields.io/badge/DELETED-red)

|                 |                                  |
|-----------------|----------------------------------|
| **Version**     | 1.0.0                            |
| **Description** | generate a random burger picture |


### ~~**/snoring**~~ 
![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow) ![](https://img.shields.io/badge/DELETED-red)

|                 |                                                       |
|-----------------|-------------------------------------------------------|
| **Version**     | 1.0.0                                                 |
| **Description** | bot come in your voice channel and snores very loudly |

### **/play `song (url_or_keywords)` `opti: bool [optional]`** 
![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow)

|                 |                                                                   |
|-----------------|-------------------------------------------------------------------|
| **Version**     | 1.2.0                                                             |
| **Description** | search music by URL or Keywords and play it in your voice channel |

<img src="./img/play.png" width="400" alt="slash command play response">

*Embed inspired from [Scathach Bot](https://github.com/sinkaroid/scathachhh) !*

- Autocompletion when you choose your favorite music !
- Increased sound quality !
- Optimisation Options Available ( *! volume control off !* )
- **✨ 1.2.0**: By default, play the last song played

Buttons menu :

- **Volume up**: Increase audio player volume
- **Stop**: Stops the audio player
- **Pause/Resume**: Pause or Resume audio player
     - **1.1.0**: You can click on the button when there is no player to play the music from the message !
- **Skip**: [_❌ Disabled Features_]
- **Volume Down**: Lower the volume of the audio player

### **/bot activity `activity-type: activity_type` `activity-message: text`** 
![](https://img.shields.io/badge/Utsukushi-v1.0.0-yellow)

|                 |                                                                                         |
|-----------------|-----------------------------------------------------------------------------------------|
| **Version**     | 1.2.0                                                                                   |
| **Formerly**    | - /activity `type: activity_type` `status: text`                                        |
| **Description** | change bot activity                                                                     |
| **Value**       | activity_type: <br>- PLAYING<br>- LISTENING<br>- STREAMING<br>- COMPETING<br>- WATCHING |

## Command 1.1.0

### **/cache `action: cache_action`** 
![](https://img.shields.io/badge/Utsukushi-v1.1.0-yellow)

|                 |                                     |
|-----------------|-------------------------------------|
| **Version**     | 1.1.0                               |
| **Description** | manage your user data               |
| **Value**       | cache_action: <br>- CLEAR<br>- SHOW |

### **/notify on `channel: text`** 
![](https://img.shields.io/badge/Utsukushi-v1.1.0-yellow)

|                 |                                                                                     |
|-----------------|-------------------------------------------------------------------------------------|
| **Version**     | 1.1.0                                                                               |
| **Formerly**    | - /notify `channel: channel_name`                                                   |
| **Description** | choose a channel, and UTSUKUSHI will notify you when someone enters a voice channel |

![](./img/notify.png)

### **/fuel `fuel: fuel_type` `search: search_method` `value: text`** 
![](https://img.shields.io/badge/Utsukushi-v1.1.0-yellow)

|                 |                                                                                                                                                                            |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Version**     | 1.0.0                                                                                                                                                                      |
| **Description** | (Only French Data) search fuel cost by search method and fuel type                                                                                                         |
| **Value**       | fuel_type: <br>- GAZOLE<br>- SP98<br>- SP95<br>- E85<br>- E10<br>- GPLc<br><br>search_method: <br>- Address<br>- City<br>- Commune<br>- Dep Name<br>- Dep Code<br>- Region |

## Command 1.2.0

### **/bot status `status-type: status_type`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                                                        |
|-----------------|------------------------------------------------------------------------|
| **Version**     | 1.0.0                                                                  |
| **Description** | Change Bot status                                                      |
| **Value**       | status_type: <br>- Online<br>- Idle<br>- Do Not Disturb<br>- Invisible |

### **/guild**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                                                        |
|-----------------|------------------------------------------------------------------------|
| **Version**     | 1.0.0                                                                  |
| **Description** | Display guild information                                              |

<img src="./img/guild.png" width="400" alt="slash command guild response">

### **/guild-share-emoji `on/off`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                                               |
|-----------------|---------------------------------------------------------------|
| **Version**     | 1.0.0                                                         |
| **Description** | Share guild emoji with other guild where Utsukushi is present |

### **/locale `language`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                                               |
|-----------------|---------------------------------------------------------------|
| **Version**     | 1.0.0                                                         |
| **Description** | Share guild emoji with other guild where Utsukushi is present |

### **/notify off**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                      |
|-----------------|--------------------------------------|
| **Version**     | 1.0.0                                |
| **Description** | Disabled notify voice channel system |

### **/play-together**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow) ![](https://img.shields.io/badge/DELETED-red)

|                 |                                           |
|-----------------|-------------------------------------------|
| **Version**     | 1.0.0                                     |
| **Description** | Start a Discord Activity in voice Channel |

### **/soundeffect play `sound-effect`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                    |
|-----------------|------------------------------------|
| **Version**     | 1.0.0                              |
| **Description** | Play sound effect in voice channel |

### **/soundeffect add `name: text` `url: youtube_url`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                                                         |
|-----------------|---------------------------------------------------------|
| **Version**     | 1.0.0                                                   |
| **Description** | Add sound effect in Utsukushi Database (30sec max only) |

### **/speak-as-bot `message: text` `attachment: file`**
![](https://img.shields.io/badge/Utsukushi-v1.2.0-yellow)

|                 |                       |
|-----------------|-----------------------|
| **Version**     | 1.0.0                 |
| **Description** | Send a message as bot |

