import { ProfileService } from "@/services/profile-service";
import { UtsukushiBotClient } from "@/bot/client";
import { logger, utsukushiASCIILog } from "@/core/logger";
import { NodeJsService } from "./services/nodejs-service";

export function main(command: string, args: any[]) {
    ProfileService.initProfile(args);
    utsukushiASCIILog();
    logger.info(`Start with "${ProfileService.profile}" profile !`);
    logger.info(`User environment from "${ProfileService.envPath}"`);
    switch (command) {
        case 'dev':
        case 'start':
            {
                const client = new UtsukushiBotClient();
                client.login();
            }
            break;
        case 'reset-commands':
            {
                const client = new UtsukushiBotClient({
                    ignoreDB: true,
                    ignoreStore: true,
                });
                const id = NodeJsService.getArg('--guild-id', args);
                if (id) client.cmdManager.resetGuild(id);
                else client.cmdManager.resetAll();
            }
            break;
        case 'deploy-commands':
            {
                const client = new UtsukushiBotClient({
                    ignoreDB: true,
                    ignoreStore: true,
                });
                client.cmdManager.deployAll();
            }
            break;
        default:
    }
}
