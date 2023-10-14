import { type HydratedDocument } from 'mongoose';
import { SongModel } from '../../database/schemas/song.schema';
import { type Song } from '../../types/business';
import { type UtsukushiBotClient } from '../../bot/client';
import { type ChatInputCommandInteraction } from 'discord.js';
import { type Track } from 'discord-player';

export class SongService {

	async save(value: Song): Promise<HydratedDocument<Song>> {
		const _song = new SongModel(value);
		return await _song.save();
	}

	async getOrCreate(song: Song): Promise<HydratedDocument<Song>> {
		const doc = await SongModel.findOne({ url: song.url }).exec();
		if (doc) return doc;
		else return await this.save(song);
	}

	static async saveTrack(track: Track, client: UtsukushiBotClient, interaction: ChatInputCommandInteraction): Promise<void> {
		const song = {
			title: track.title,
			url: track.url,
			source: interaction.options.getString('source') ?? undefined,
		};
		await client.store.users.addSong(interaction.user, song);
		await client.store.guilds.updateLastTrack(interaction.guild as any, song);
	}
}