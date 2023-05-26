import pino from 'pino';
import pretty from 'pino-pretty';

const LOG_DIR = './logs';
const DATE_NOW = Date.now();
const INIT_DATE = new Date(DATE_NOW).toLocaleDateString().replaceAll('/', '');
const INIT_TIME = new Date(DATE_NOW).toLocaleTimeString().replaceAll(':', '');

const createSonicBoom = (dest: string) =>
	pino.destination({ dest: dest, append: false, sync: false, mkdir: true });

const streams: pino.StreamEntry[] = [
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
			level: (label) => {
				return { level: label.toUpperCase() };
			},
		},
	},
	pino.multistream(streams)
);
