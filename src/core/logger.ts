import { cyan, green, lightGreen, lightMagenta, lightYellow, magenta, red, yellow } from 'ansicolor';
import json from 'package';
import pino from 'pino';
import pretty from 'pino-pretty';

const LOG_DIR = './logs';
const DATE_NOW = Date.now();
const INIT_DATE = new Date(DATE_NOW).toLocaleDateString().replaceAll('/', '');
const INIT_TIME = new Date(DATE_NOW).toLocaleTimeString().replaceAll(':', '');

const DEST = `${LOG_DIR}/info${INIT_DATE + INIT_TIME}.log`;
const SONIC_BOOM_CONFIG = { dest: DEST, append: false, sync: false, mkdir: true };

const streams: any[] = [
	{ stream: pino.destination(SONIC_BOOM_CONFIG) },
	{
		stream: pretty({
			colorize: true,
			sync: true,
		}),
	},
	{ level: 'error', stream: pino.destination(SONIC_BOOM_CONFIG) },
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
 * Make a log of UTSUKUSHI title with version project
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
 * Make a log of Bot login
 */
export function botLoginLog(name: string) {
    logger.info(lightYellow(`Logged in as ${cyan(name)}!`));
}

/**
 * Make a log when Bot commands deployement started
 */
export function botStartDeployCommand() {
	logger.info(lightGreen('Started refreshing application global (/) commands...'));
}

/**
 * Make a log when Bot commands deployement finished
 */
export function botFinishDeployCommand(size: number) {
	logger.info(
		green(
			`Successfully reloaded application ${size} global (/) commands !`
		)
	);
}

/**
 * Make a log when Bot commands reset started
 */
export function botStartResetCommand() {
	logger.info(lightGreen('Started reset all (/) commands...'));
}

/**
 * Make a log when Bot commands reset finished
 */
export function botFinishResetCommand() {
	logger.info(green(`Successfully reset all (/) commands !`));
}

/**
 * Make a log when Bot guild commands deployement started
 */
export function botStartGuildDeployCommand(guildId: string) {
	logger.info(lightGreen(`Started refreshing guild "${guildId}" application global (/) commands...`));
}

/**
 * Make a log when Bot guild commands deployement finished
 */
export function botFinishGuildDeployCommand(guildId: string, size: number) {
	logger.info(
		green(
			`Successfully reloaded guild "${guildId}" application ${size} global (/) commands !`
		)
	);
}

/**
 * Make a log when Bot guild commands reset started
 */
export function botStartGuildResetCommand(guildId: string) {
	logger.info(magenta(`Started reset all guild "${guildId}" (/) commands...`));
}

/**
 * Make a log when Bot guild commands reset finished
 */
export function botFinishGuildResetCommand(guildId: string) {
	logger.info(lightMagenta(`Successfully reset all guild "${guildId}" (/) commands !`));
}

export function botConnectedDB() {
	logger.info(green('Connect to Database !'))
}