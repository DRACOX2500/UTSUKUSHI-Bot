import { Song, User } from "../../types/business";
import { User as UserDJS } from 'discord.js';
import { UserModel } from "../../database/schemas/user.schema";
import { SongService } from '../database/song-service';
import { AbstractRecordDocStore } from "./abstract-record-doc-store";
import { Document, HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { SoundEffectService } from "../database/sound-effect-service";

const POPULATE = ['songs.list.item'];

export class UserStore extends AbstractRecordDocStore<User> {

    private songService: SongService;
    private soundEffectService: SoundEffectService;

    constructor() {
        super(UserModel, 'users-cache');
        this.songService = new SongService();
        this.soundEffectService = new SoundEffectService();
    }

    override async update(id: string, value: UpdateQuery<User> | Partial<User> | object) {
        return this.updateItem(id, value, POPULATE);
    }

    override async getItem(id: string): Promise<User | null> {
        return super.getItem(id, POPULATE);
    }

    override async removeItem(id: string): Promise<HydratedDocument<User> | null> {
        const doc = await super.removeItem(id);
        if (doc) await this.soundEffectService.removeByUser(doc);
        return doc;
    }

    getOrAddItemByUser(user: UserDJS): Promise<User> {
        const value: User = {
            id: user.id,
            songs: {
                enabled: true,
                list: [],
            }
        }
        return this.getOrAddItem(value);
    }

    async getOrAddDocByUser(user: UserDJS): Promise<HydratedDocument<User>> {
        const _user = await this.getOrAddItemByUser(user);
		return this.getDocById(_user.id, POPULATE) as any;
    }

    isInSongslist(user: User, song: Song) {
        return user.songs.list
            .map(_song => _song.item.url)
            .includes(song.url);
    }

    async updateHistoric(user: UserDJS, historic: boolean) {
        await this.update(
            user.id,
            {
                'songs.enabled': historic,
            },
        );
    }

    async addSong(user: UserDJS, song: Song) {
        const _user = await this.getItem(user.id);
        if (!_user) return;

        if (this.isInSongslist(_user, song) || !_user?.songs.enabled) return;

        const _song = await this.songService.getOrCreate(song);
        await this.update(
            user.id,
            {
                $push: {
                    'songs.list': {
                        item: _song,
                        date: new Date(),
                    }
                }
            },
        );
    }

    async removeSoundEffect(url: string, user?: UserDJS): Promise<void> {
        let _user: HydratedDocument<User> | undefined;
        if (user) _user = await this.getDocById(user.id) ?? undefined;
        await this.soundEffectService.remove(url, _user);
    }
}