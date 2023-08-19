import { cyan, green, lightGreen, lightMagenta, lightYellow, magenta, red, yellow } from 'ansicolor';
import json from 'package';
import pino from 'pino';
import pretty from 'pino-pretty';
import { ChatInputCommandInteraction, ButtonInteraction, MessageContextMenuCommandInteraction, ModalSubmitInteraction, UserContextMenuCommandInteraction, StringSelectMenuInteraction } from 'discord.js';

const LOG_DIR = './logs';
const DATE_NOW = Date.now();
const INIT_DATE = new Date(DATE_NOW).toLocaleDateString().replaceAll('/', '');
const INIT_TIME = new Date(DATE_NOW).toLocaleTimeString().replaceAll(':', '');

const DEST = `${LOG_DIR}/info${INIT_DATE + INIT_TIME}.log`;
const SONIC_BOOM_CONFIG = { dest: DEST, append: false, sync: false, mkdir: true };

const streams: any[] = [
	// { stream: pino.destination(SONIC_BOOM_CONFIG) },
	{
		stream: pretty({
			colorize: true,
			sync: true,
		}),
	},
	// { level: 'error', stream: pino.destination(SONIC_BOOM_CONFIG) },
];

const log = pino(
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

const logger = {

	debug(value: any) {
		log.debug(value);
	},

	info(value: any) {
		log.info(value);
	},

	warn(value: any) {
		log.warn(value);
	},

	error(value: any, error?: any) {
		log.error(error, value);
	},

	startUp(profile: string, envPath: string) {
		log.info(`Start with "${profile}" profile !`);
    	log.info(`Use environment variables from "${envPath}"`);
	},

	/**
	 * Make a log of UTSUKUSHI title with version project
	 */
	utsukushiASCIILog(): void {
		log.info(
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
	},

	/**
	 * Make a log of Bot login
	 */
	botLoginLog(name: string) {
		log.info(lightYellow(`Logged in as ${cyan(name)}!`));
	},

	/**
	 * Make a log when Bot commands deployement started
	 */
	botStartDeployCommand() {
		log.info(lightGreen('Started refreshing application global (/) commands...'));
	},

	/**
	 * Make a log when Bot commands deployement finished
	 */
	botFinishDeployCommand(cmdSize: number, ctxSize: number) {
		log.info(
			green(
				`Successfully reloaded application ${cmdSize} global (/) commands & ${ctxSize} contexts !`
			)
		);
	},

	/**
	 * Make a log when Bot commands reset started
	 */
	botStartResetCommand() {
		log.info(lightGreen('Started reset all (/) commands...'));
	},

	/**
	 * Make a log when Bot commands reset finished
	 */
	botFinishResetCommand() {
		log.info(green(`Successfully reset all (/) commands !`));
	},

	/**
	 * Make a log when Bot guild commands deployement started
	 */
	botStartGuildDeployCommand(guildId: string) {
		log.info(lightGreen(`Started refreshing guild "${guildId}" application global (/) commands...`));
	},

	/**
	 * Make a log when Bot guild commands deployement finished
	 */
	botFinishGuildDeployCommand(guildId: string, cmdSize: number, ctxSize: number) {
		log.info(
			green(
				`Successfully reloaded guild "${guildId}" application ${cmdSize} global (/) commands & ${ctxSize} contexts !`
			)
		);
	},

	/**
	 * Make a log when Bot guild commands reset started
	 */
	botStartGuildResetCommand(guildId: string) {
		log.info(magenta(`Started reset guild "${guildId}" (/) commands...`));
	},

	/**
	 * Make a log when Bot guild commands reset finished
	 */
	botFinishGuildResetCommand(guildId: string) {
		log.info(lightMagenta(`Successfully reset guild "${guildId}" (/) commands !`));
	},

	botConnectedDB() {
		log.info(green('Connect to Database !'))
	},

	chatCommand(interaction: ChatInputCommandInteraction) {
		const prefix = `[SlashCommand] ${interaction.user.username} : ${interaction.commandName}`;
		try {
			const subcommand = interaction.options.getSubcommand();
			logger.info(`${prefix} ${subcommand}`);
		} catch (error) {
			logger.info(prefix);
		}
	},

	button(interaction: ButtonInteraction) {
		logger.info(`[Button] ${interaction.user.username} : ${interaction.customId}`);
	},

	context(interaction: MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) {
		logger.info(`[Context] ${interaction.user.username} : ${interaction.commandName}`);
	},

	modal(interaction: ModalSubmitInteraction) {
		logger.info(`[Modal] ${interaction.user.username} : ${interaction.customId}`);
	},

	select(interaction: StringSelectMenuInteraction) {
		logger.info(`[Select] ${interaction.user.username} : ${interaction.customId}`);
	}
}

export default logger;