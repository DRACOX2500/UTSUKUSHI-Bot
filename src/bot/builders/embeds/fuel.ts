import { RED_FUEL_PUMP } from "@/constants";
import { Fuel } from "@/services/api/fuel-api-service";
import { EmbedBuilder, time } from "discord.js";

export class FuelEmbed extends EmbedBuilder {

	constructor(data: any, fuel: Fuel, index: number) {
        super();

        this
            .setAuthor({ name: `Result#${index + 1}`, iconURL: RED_FUEL_PUMP })
            .setColor(0x2b1291)
            // .setDescription(
            //     `**Address** : ${data.fields.adresse}\n` +
            //         `**Services** : ${data.fields.services_service?.replaceAll(
            //             '//',
            //             ', '
            //         )}\n\n` +
            //         `**Last Data Updated** : ${time(new Date(data.fields.prix_maj))}`
            // )
            .addFields(
                {
                    name: 'Address :',
                    value: data.fields.adresse,
                },
                {
                    name: 'Services :',
                    value: data.fields.services_service?.replaceAll(
                        '//',
                        ', '
                    ),
                },
                {
                    name: 'Last Data Updated :',
                    value: time(new Date(data.fields.prix_maj)),
                },
                {
                    name: 'Fuel cost',
                    value: `${fuel} : ${data.fields.prix_valeur}€/L`,
                },
                { name: 'City :', value: data.fields.ville, inline: true },
                {
                    name: 'Department :',
                    value: `(${data.fields.dep_code}) ${data.fields.dep_name}`,
                    inline: true,
                },
                { name: 'Region :', value: data.fields.reg_name, inline: true }
            )
            .setImage(`attachment://fuel-${index}.webp`);
	}
}