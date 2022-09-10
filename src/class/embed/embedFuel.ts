import { EmbedBuilder, time } from 'discord.js';
import { RED_FUEL_PUMP } from '../../utils/const';
import { DataEconomieGouvResponseRecord } from '../../model/DataEconomieGouv';

export class EmbedFuel {

	apiResponse!: DataEconomieGouvResponseRecord[];
	fuelType!: string;

	constructor(response: DataEconomieGouvResponseRecord[], fuelType: string) {
		this.apiResponse = response;
		this.fuelType = fuelType;
	}

	getEmbed(): EmbedBuilder[] {
		const embeds: EmbedBuilder[] = [];
		let res = 0;

		for (const data of this.apiResponse) {
			res += 1;
			embeds.push(
				new EmbedBuilder()
					.setAuthor({ name: `Result#${res}`, iconURL: RED_FUEL_PUMP })
					.setColor(0x2B1291)
					.setDescription(
						`**Address** : ${data.fields.adresse}\n` +
                        `**Services** : ${data.fields.services_service.replaceAll('//', ', ')}\n` +
                        '⛽---------------------------------------------------------------🚙💨\n' +
                        `**Last Data Updated** : ${time(new Date(data.fields.prix_maj))}`
					)
					.addFields(
						{ name: 'Fuel cost', value: `${this.fuelType} : ${data.fields.prix_valeur}€/L` },
						{ name: 'City :', value: data.fields.ville, inline: true },
						{ name: 'Department :', value: `(${data.fields.dep_code}) ${data.fields.dep_name}`, inline: true },
						{ name: 'Region', value: data.fields.reg_name, inline: true },
					)
			);
		}

		return embeds;
	}
}