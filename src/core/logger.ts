import { cyan, green, lightGreen, lightYellow, red, yellow } from 'ansicolor';
import json from 'package';
import pino from 'pino';
import pretty from 'pino-pretty';

const LOG_DIR = './logs';
const DATE_NOW = Date.now();
const INIT_DATE = new Date(DATE_NOW).toLocaleDateString().replaceAll('/', '');
const INIT_TIME = new Date(DATE_NOW).toLocaleTimeString().replaceAll(':', '');

const createSonicBoom = (dest: string) =>
	pino.destination({ dest: dest, append: false, sync: false, mkdir: true });

const streams: any[] = [
	{ stream: createSonicBoom(`${LOG_DIR}/info${INIT_DATE + INIT_TIME}.log`) },
	{
		stream: pretty({
			colorize: true,
			sync: true,
		}),
	},
	{ level: 'error', stream: createSonicBoom(`${LOG_DIR}/error${INIT_DATE + INIT_TIME}.log`) },
];

export const logger = pino(
	{
		level: 'info',
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
		formatters: {
			bindings: () => {
				return {};
			},
			level: (label: string) => {
				return { level: label.toUpperCase() };
			},
		},
	},
	pino.multistream(streams)
);

/**
 * Make a console.log of UTSUKUSHI title with version project
 */
export function utsukushiASCIILog(): void {
    logger.info(
        yellow(
			'\n' +
            ' _    _ _             _              _     _ \n' +
                '| |  | | |           | |            | |   (_)\n' +
                '| |  | | |_ ___ _   _| | ___   _ ___| |__  _ \n' +
                '| |  | | __/ __| | | | |/ / | | / __| \'_ \\| |\n' +
                '| |__| | |_\\__ \\ |_| |   <| |_| \\__ \\ | | | |\n' +
                '\\_____/\\___|___/\\__,_|_|\\_\\\\__,_|___/_| |_|_|\n' +
                `${red('v' + json.version)}\n`
        )
    );
}

/**
 * Make a console.log of Bot login
 */
export function botLoginLog(name: string) {
    logger.info(lightYellow(`Logged in as ${cyan(name)}!`));
}

/**
 * Make a console.log when Bot commands deployement started
 */
export function botStartDeployCommand() {
	logger.info(lightGreen('Started refreshing application global (/) commands...'));
}

/**
 * Make a console.log when Bot commands deployement finished
 */
export function botFinishDeployCommand(size: number) {
	logger.info(
		green(
			`Successfully reloaded application ${size} global (/) commands !`
		)
	);
}

export function botConnectedDB() {
	logger.info(green('Connect to Database !'))
}