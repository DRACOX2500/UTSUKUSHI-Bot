import { red, yellow } from 'ansicolor';
import { UtsukushiClient } from 'src/utsukushi-client';
import json from './package.json';

console.log(
	yellow(
		' _    _ _             _              _     _ \n' +
			'| |  | | |           | |            | |   (_)\n' +
			'| |  | | |_ ___ _   _| | ___   _ ___| |__  _ \n' +
			'| |  | | __/ __| | | | |/ / | | / __| \'_ \\| |\n' +
			'| |__| | |_\\__ \\ |_| |   <| |_| \\__ \\ | | | |\n' +
			'\\_____/\\___|___/\\__,_|_|\\_\\\\__,_|___/_| |_|_|\n' +
			`${red('v' + json.version)}\n`
	)
);

const client = new UtsukushiClient();

client.loginBot();
