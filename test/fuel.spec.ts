/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmbedFuel } from 'root/src/modules/system/embeds/fuel.embed';
import { DataEconomieGouvResponseRecord } from '@models/api/DataEconomieGouv';
import { FuelAPI } from 'root/src/api/fuel-fr/fuel.api';
import { FuelCommand } from 'root/src/modules/interactions/commands/fuel/fuel.cmd';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';

async function getApiResponse(): Promise<DataEconomieGouvResponseRecord[] | null> {

	const api = new FuelAPI();
	api.setPrixNom('Gazole');
	api.setVille('Paris');
	const response = await api.getReponse();

	if (typeof response === 'string') return null;
	return response;
}

function isDataEconomieGouvResponseRecord(arg: any): arg is DataEconomieGouvResponseRecord {
	return 'datasetid' in arg;
}

function isEmbedBuilder(arg: any): arg is EmbedBuilder {
	return 'addFields' in arg;
}

function isAttachmentBuilder(arg: any): arg is AttachmentBuilder {
	return 'attachment' in arg;
}

describe('Fuel Module', () => {

	test('Test cache Command Clear', async () => {
		// const fuelRes = await FuelCommand.result(null);
		// expect(fuelRes).toBe(void 0);
	});

	test('Test Fuel API', async () => {
		const response = await getApiResponse();
		expect(isDataEconomieGouvResponseRecord(response?.at(0))).toBe(true);
	});

	test('Test Fuel Embed', async () => {
		let embed = null;
		const response = await getApiResponse();
		if (response) {
			const fuelEmbed = new EmbedFuel(response[0], 'Gazole');
			embed = fuelEmbed.getEmbed(0);
		}
		expect(isEmbedBuilder(embed)).toBe(true);
	});

	test('Test Fuel Embed', async () => {
		let image = null;
		const response = await getApiResponse();
		if (response) {
			const fuelEmbed = new EmbedFuel(response[0], 'Gazole');
			image = await fuelEmbed.getImages(0);
		}
		expect(isAttachmentBuilder(image)).toBe(true);
	});
});