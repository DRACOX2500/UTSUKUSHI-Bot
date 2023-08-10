import { UtsukushiBotClient } from "@/bot/client";
import { utsukushiASCIILog } from "@/core/logger";

export function main(command: string, args: any[]) {
    const client = new UtsukushiBotClient();
    switch (command) {
        case 'start':
            {
                utsukushiASCIILog();
                client.login();
            }
            break;
        case 'reset-commands':
            break;
        case 'deploy-command':
            break;
        case 'deploy-commands':
            client.cmdManager.deployAll();
            break;
        default:
    }
}
