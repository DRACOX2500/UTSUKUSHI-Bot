import { type ChatInputCommandInteraction, type CacheType } from 'discord.js';
import { BotSlashCommand } from '../../../../core/bot-command';
import { ERROR_CMD_MESSAGE, ERROR_COMMAND } from '../../../../core/constants';
import { FuelApiService, type Fuel } from '../../../../services/api/fuel-api-service';
import { StaticMapsService } from '../../../../services/staticmaps-service';
import { FuelEmbed } from '../../../builders/embeds/fuel';
import { type UtsukushiBotClient } from '../../../client';


/**
 * @SlashCommand `fuel`
 *  - `fuel [fuel] [search] [value]` : get fuel spots with the specified search method !
 */
class SpeakAsBotCommand extends BotSlashCommand<UtsukushiBotClient> {

	constructor() {
		super();

		this.command
			.setName('fuel')
			.setDescription('Get some data about fuel (Only in France) 🚗!')
			.setDMPermission(true)
			.addStringOption(option =>
				option
					.setName('fuel')
					.setDescription('Choose your fuel')
					.addChoices(...FuelApiService.fuelsChoices)
					.setRequired(true),
			)
			.addIntegerOption(option =>
				option
					.setName('search')
					.setDescription('Search by...')
					.addChoices(...FuelApiService.fuelsSearchChoices)
					.setRequired(true),
			)
			.addStringOption((option) =>
				option
					.setName('value')
					.setDescription('Value to search')
					.setRequired(true),
			);
	}

	override async result(interaction: ChatInputCommandInteraction<CacheType>, client: UtsukushiBotClient, options?: any): Promise<void> {
		const channel = interaction.channel;
		if (!channel) {
			await interaction.reply({ content: ERROR_CMD_MESSAGE, ephemeral: true });
			throw new Error(ERROR_COMMAND);
		}

		await interaction.deferReply();

		const fuel = interaction.options.getString('fuel', true) as Fuel;
		const search = interaction.options.getInteger('search', true);
		const value = interaction.options.getString('value', true);

		const fuels = await FuelApiService.search(fuel, search, value);
		if (fuels.records.length === 0) {
			await interaction.editReply('❌ No fuel source found !');
			return;
		}
		await interaction.editReply(`⛽ ${fuels.records.length} fuel sources have been found !`);

		fuels.records.forEach(async (_data, index) => {
			const embed = new FuelEmbed(_data, fuel, index);
			const attchment = await StaticMapsService.getAttchmentMap(_data.geometry.coordinates, index);

			await channel.send({ embeds: [embed], files: [attchment] });
		});
	}
}

export const command = new SpeakAsBotCommand();