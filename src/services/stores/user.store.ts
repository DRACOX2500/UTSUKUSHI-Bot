import { Song, User } from "../../types/business";
import { User as UserDJS } from 'discord.js';
import { UserModel } from "../../database/schemas/user.schema";
import { AbstractRecordStore } from "./abstract-record-store";
import logger from "../../core/logger";
import { SongService } from '../database/song-service';

export class UserStore extends AbstractRecordStore<User> {

    private songService: SongService;

    constructor() {
        super(UserModel, {});
        this.songService = new SongService();
    }

    override save(id: string, value: User): User {
        const _value: User = {
            id: value.id,
            songs: value.songs,
        }
        return super.save(id, _value);
    }

    private async getFromDB(userId: string): Promise<User | null> {
        const doc = await UserModel.findOne({ id: userId }).exec();
        if (doc) return this.save(doc.id, doc);
        return null;
    }

    async create(user: User): Promise<User> {
        const doc = new UserModel(user);
        const saved = await doc.save();
        return this.save(saved.id, saved);
    }

    async getOrCreate(user: UserDJS): Promise<User> {
        const doc = await this.get(user.id);
        if (doc) return doc;
        else {
            const _save: User = {
                id: user.id,
                songs: [],
            };
            return this.create(_save);
        }
    }

    async get(userId: string): Promise<User | null> {
        const user = this.value[userId];
        if (!user)  return this.getFromDB(userId);
        return user;
    }

    async removeDoc(user: UserDJS) {
        await this.schema.deleteOne({ id: user.id }).exec();
    }

    async addSong(user: UserDJS, song: Song) {
        try {
            const _user = await this.getOrCreate(user);
            const _song = await this.songService.getOrCreate(song);
            await UserModel.updateOne(
                { id: _user.id },
                {
                    $push: { songs: _song }
                },
                { new: true }
            ).exec();
        } catch (error) {
            logger.error("", error);
        }
    }
}