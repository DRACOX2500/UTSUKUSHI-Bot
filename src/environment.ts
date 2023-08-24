import { config } from 'dotenv';
import pack from './../package.json';
import { ProfileService } from './services/profile-service';

config({ path: ProfileService.envPath });

export const environment = {
	APP_VERSION: pack.version,
	SRC_PATH: __dirname,
	NPM_SCRIPT: process.env.npm_lifecycle_event ?? '',
	DISCORD_TOKEN: process.env.DISCORD_TOKEN ?? '',
	CLIENT_ID: process.env.CLIENT_ID ?? '',
	DB_URL: process.env.DB_URL ?? '',
};