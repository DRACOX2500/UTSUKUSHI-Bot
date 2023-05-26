import pino from 'pino';
import pretty from 'pino-pretty';
const logdir = './logs';

const createSonicBoom = (dest: string) =>
	pino.destination({ dest: dest, append: false, sync: false, mkdir: true });

const streams: pino.StreamEntry[] = [
	{ stream: createSonicBoom(`${logdir}/info.log`) },
	{
		stream: pretty({
			colorize: true,
			sync: true,
		}),
	},
	{ level: 'error', stream: createSonicBoom(`${logdir}/error.log`) },
];

export const logger = pino(
	{
		level: 'info',
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
	},
	pino.multistream(streams)
);
