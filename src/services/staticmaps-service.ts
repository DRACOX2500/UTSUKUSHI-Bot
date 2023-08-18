import fs from 'node:fs';

import { AttachmentBuilder } from 'discord.js';
import StaticMaps from 'staticmaps';
import { CACHE_REPO } from '@/constants';

const staticMaps = new StaticMaps({
    width: 400,
    height: 400,
});

const ZOOM = 17;

export class StaticMapsService {

    static async getAttchmentMap(coords: number[], index: number = 0) {
        if (!fs.existsSync(CACHE_REPO)) fs.mkdirSync(CACHE_REPO);

        await staticMaps.render(coords, ZOOM);
        await staticMaps.image.save(`.cache/fuel-${index}.webp`);

        return new AttachmentBuilder(`.cache/fuel-${index}.webp`);
    }
}