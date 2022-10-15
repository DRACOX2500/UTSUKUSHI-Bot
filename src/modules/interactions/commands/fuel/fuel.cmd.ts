/* eslint-disable no-shadow */
import {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	SlashCommandIntegerOption,
	SlashCommandStringOption,
	TextChannel,
} from 'discord.js';
import { EmbedFuel } from 'root/src/modules/system/embeds/fuel.embed';
import { API } from '@utils/const';
import { FuelAPI } from 'root/src/api/fuel-fr/fuel.api';
import { UtsukushiSlashCommand } from '@models/UtsukushiCommand';

enum FuelType {
	GAZOLE = 'Gazole',
	SP98 = 'SP98',
	SP95 = 'SP95',
	E85 = 'E85',
	E10 = 'E10',
	GPLc = 'GPLc',
}

enum SearchType {
	ADDRESS = 0,
	CITY = 1,
	COMMUNE = 2,
	DEPARTMENT_NAME = 3,
	DEPARTMENT_CODE = 4,
	REGION = 5,
}

/**
 * @SlashCommand `fuel`
 *  - `fuel [fuel] [search] [value]` : get 3 fuel spots with the specified search method
 */
export class FuelCommand implements UtsukushiSlashCommand {
	readonly command = new SlashCommandBuilder()
		.setName('fuel')
		.setDescription('Get some data about fuel (Only in France) 🚗!')
		.setDMPermission(true)
		.addStringOption((option: SlashCommandStringOption) =>
			option
				.setName('fuel')
				.setDescription('Choose your fuel')
				.addChoices(
					{ name: 'Gazole', value: FuelType.GAZOLE },
					{ name: 'SP98', value: FuelType.SP98 },
					{ name: 'SP95', value: FuelType.SP95 },
					{ name: 'E85', value: FuelType.E85 },
					{ name: 'E10', value: FuelType.E10 },
					{ name: 'GPLc', value: FuelType.GPLc }
				)
				.setRequired(true)
		)
		.addIntegerOption((option: SlashCommandIntegerOption) =>
			option
				.setName('search')
				.setDescription('Search By ...')
				.addChoices(
					{ name: 'Address', value: SearchType.ADDRESS },
					{ name: 'City', value: SearchType.CITY },
					{ name: 'Commune', value: SearchType.COMMUNE },
					{ name: 'Department Name', value: SearchType.DEPARTMENT_NAME },
					{ name: 'Department Code', value: SearchType.DEPARTMENT_CODE },
					{ name: 'Region', value: SearchType.REGION }
				)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('value')
				.setDescription('Value to search')
				.setRequired(true)
		);

	readonly result = async (
		interaction: ChatInputCommandInteraction
	): Promise<void> => {
		await interaction.deferReply();

		const fuel = <string>interaction?.options.get('fuel')?.value ?? 'Gazole';
		const search = <number>interaction?.options.get('search')?.value ?? 1;
		const value = <string>interaction?.options.get('value')?.value ?? 'Paris';

		const api = new FuelAPI();

		api.setPrixNom(fuel);

		switch (search) {
		case 0:
			api.setAdresse(value);
			break;
		case 1:
			api.setVille(value);
			break;
		case 2:
			api.setCommune(value);
			break;
		case 3:
			api.setDepartement(value);
			break;
		case 4: {
			let newValue = value;
			if (value.match(/^\d$/)) newValue = '0' + value;
			api.setDepartementCode(newValue);
			break;
		}
		case 5:
			api.setRegion(value);
			break;
		}

		const response = await api.getReponse();

		if (typeof response === 'string' || response.length === 0) {
			interaction.editReply(API.FUEL.ERROR);
			return;
		}

		const channel = <TextChannel>interaction?.channel;

		let i = 0;
		for (const data of response) {
			const fuelEmbed = new EmbedFuel(data, fuel);
			const embed = fuelEmbed.getEmbed(i);
			const image = await fuelEmbed.getImages(i);

			channel.send({ embeds: [embed], files: [image] });

			i++;
		}
		interaction.editReply(
			`⛽ ${i} fuel source ${i > 1 ? 'have' : 'has'} been found !`
		);
	};
}

export const command = new FuelCommand();
