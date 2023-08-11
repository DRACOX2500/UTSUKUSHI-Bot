import { UtsukushiBotClient } from "@/bot/client";
import { utsukushiASCIILog } from "@/core/logger";

export function main(command: string, args: any[]) {
    switch (command) {
        case 'start':
            {
                utsukushiASCIILog();
                const client = new UtsukushiBotClient();
                client.login();
            }
            break;
        case 'reset-commands':
            {
                const client = new UtsukushiBotClient({ ignoreDB: true });
                client.cmdManager.resetAll();
            }
            break;
        case 'deploy-command':
            throw new Error("script not exist !");
        case 'deploy-commands':
            {
                const client = new UtsukushiBotClient({ ignoreDB: true });
                client.cmdManager.deployAll();
            }
            break;
        default:
    }
}
