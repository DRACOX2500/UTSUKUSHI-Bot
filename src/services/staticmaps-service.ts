import fs from 'node:fs';

import { AttachmentBuilder } from 'discord.js';
import StaticMaps from 'staticmaps';
import { CACHE_REPO } from '../constants';

export class StaticMapsService {

	private static readonly staticMaps = new StaticMaps({
		width: 400,
		height: 400,
	});

	private static readonly ZOOM = 17;

	static async getAttchmentMap(coords: number[], index: number = 0): Promise<AttachmentBuilder> {
		if (!fs.existsSync(CACHE_REPO)) fs.mkdirSync(CACHE_REPO);

		await StaticMapsService.staticMaps.render(coords, StaticMapsService.ZOOM);
		await StaticMapsService.staticMaps.image.save(`.cache/fuel-${index}.webp`);

		return new AttachmentBuilder(`.cache/fuel-${index}.webp`);
	}
}