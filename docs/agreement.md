# Utsukushi Code Agreement

## Project Structure

```
.github/                        # GitHub Action CI scripts  
docs/                           # Project Docs
src/
|- api/                         # APIs Communications
|- assets/                      # Images and other assets
|- database/                    # Database Communications + Cache
|- errors/                      # NodeJs Errors Manager 
|- models/                      # TS interfaces & types
|- modules/
|   |- interactions/            # All Discord Interactions Classes
|   |   |- buttons/
|   |   |- commands/
|   |   |- contexts/
|   |   |- events/
|   |   |- modals/
|   |   |- selects/
|   |   |- CommandDeployer.ts   # Command Deployer on Discord API
|   |   |- CommandManager.ts    # Command Manager (Load & Receive)
|   |- system/                
|- utils/                       # Utilities Functions
+- UtsukushiClient.ts                 # Utsukushi Discord Client
test/
|- mocks/                       # Mocks Discord API
+- ...                          # Unit tests
.env                            # Environment Variables
.eslintrc.json                  # EsLint Configuration
.gitignore
.index.ts                       # Main
.jest.config.ts                 # Jest Configuration
package-lock.json
package.json
README.md
sonar-project.properties        # SonarCloud Configuration
tsconfig.json                   # TypeScript Compiler Configuration
utsukushi.config.json           # Utsukushi Configuration
```
