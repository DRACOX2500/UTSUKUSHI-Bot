import { AttachmentBuilder, EmbedBuilder, time } from 'discord.js';
import { RED_FUEL_PUMP } from '../../utils/const';
import { DataEconomieGouvResponseRecord } from '../../model/DataEconomieGouv';
import StaticMaps from 'staticmaps';

export class EmbedFuel {

	apiResponse!: DataEconomieGouvResponseRecord[];
	fuelType!: string;
	imagePath: AttachmentBuilder[] = [];

	constructor(response: DataEconomieGouvResponseRecord[], fuelType: string) {
		this.apiResponse = response;
		this.fuelType = fuelType;
	}

	async getMap(data: DataEconomieGouvResponseRecord, res: number): Promise<void> {
		const options = {
			width: 400,
			height: 400,
		};
		const map = new StaticMaps(options);
		const zoom = 17;
		const center = [data.geometry.coordinates[0], data.geometry.coordinates[1]];

		await map.render(center, zoom);
		await map.image.save(`assets/fuel${res}.webp`);

		this.imagePath.push(new AttachmentBuilder(`assets/fuel${res}.webp`));
	}

	async getImages(): Promise<AttachmentBuilder[]> {
		let res = 0;
		for (const data of this.apiResponse) {
			res += 1;
			await this.getMap(data, res);
		}
		return this.imagePath;
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
					.setImage(`attachment://fuel${res}.webp`)
			);
		}

		return embeds;
	}
}