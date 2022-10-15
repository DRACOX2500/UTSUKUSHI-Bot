import { AttachmentBuilder, EmbedBuilder, time } from 'discord.js';
import { RED_FUEL_PUMP } from '@utils/const';
import { DataEconomieGouvResponseRecord } from 'root/src/models/api/data-economie-gouv.model';
import StaticMaps from 'staticmaps';

export class EmbedFuel {
	apiResponse!: DataEconomieGouvResponseRecord;
	fuelType!: string;
	imagePath!: AttachmentBuilder;

	constructor(response: DataEconomieGouvResponseRecord, fuelType: string) {
		this.apiResponse = response;
		this.fuelType = fuelType;
	}

	async getMap(index: number): Promise<AttachmentBuilder> {
		const data = this.apiResponse;
		const options = {
			width: 400,
			height: 400,
		};
		const map = new StaticMaps(options);
		const zoom = 17;
		const center = [data.geometry.coordinates[0], data.geometry.coordinates[1]];

		await map.render(center, zoom);
		await map.image.save(`src/assets/fuel${index}.webp`);

		return new AttachmentBuilder(`src/assets/fuel${index}.webp`);
	}

	async getImages(index: number): Promise<AttachmentBuilder> {
		return this.getMap(index);
	}

	getEmbed(index: number): EmbedBuilder {
		const data = this.apiResponse;

		return new EmbedBuilder()
			.setAuthor({ name: `Result#${index + 1}`, iconURL: RED_FUEL_PUMP })
			.setColor(0x2b1291)
			.setDescription(
				`**Address** : ${data.fields.adresse}\n` +
					`**Services** : ${data.fields.services_service?.replaceAll(
						'//',
						', '
					)}\n` +
					'⛽---------------------------------------------🚙💨\n' +
					`**Last Data Updated** : ${time(new Date(data.fields.prix_maj))}`
			)
			.addFields(
				{
					name: 'Fuel cost',
					value: `${this.fuelType} : ${data.fields.prix_valeur}€/L`,
				},
				{ name: 'City :', value: data.fields.ville, inline: true },
				{
					name: 'Department :',
					value: `(${data.fields.dep_code}) ${data.fields.dep_name}`,
					inline: true,
				},
				{ name: 'Region', value: data.fields.reg_name, inline: true }
			)
			.setImage(`attachment://fuel${index}.webp`);
	}
}
