import { Song, User } from "../../types/business";
import { User as UserDJS } from 'discord.js';
import { UserModel } from "../../database/schemas/user.schema";
import { AbstractRecordStore } from "./abstract-record-store";
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
            historicEnabled: value.historicEnabled,
            songs: value.songs,
        }
        return super.save(id, _value);
    }

    private async getFromDB(userId: string): Promise<User | null> {
        const doc = await UserModel
            .findOne({ id: userId })
            .populate('songs')
            .exec();
        if (doc) return this.save(doc.id, doc);
        return null;
    }

    async create(user: User): Promise<User> {
        const doc = new UserModel(user);
        const saved = await doc.save();
        return this.save(saved.id, saved);
    }

    async update(userId: string, user: Partial<User> | object ) {
        return UserModel.findOneAndUpdate(
            { id: userId },
            {
                ...user,
            },
            { new: true }
        )
        .populate('songs')
        .exec();
    }

    async getOrCreate(user: UserDJS): Promise<User> {
        const doc = await this.get(user.id);
        if (doc) return doc;
        else {
            const _save: User = {
                id: user.id,
                historicEnabled: true,
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

    isInSongslist(user: User, song: Song) {
        return user.songs
            .map(_song => _song.url)
            .includes(song.url);
    }

    async updateHistoric(user: UserDJS, historic: boolean) {
        const _user = await this.getOrCreate(user);
        const updoc = await this.update(
            _user.id,
            {
                historicEnabled: historic,
            },
        );
        console.log(updoc);

        if (updoc) this.save(updoc.id, updoc);
    }

    async addSong(user: UserDJS, song: Song) {
        const _user = await this.getOrCreate(user);

        if (
            this.isInSongslist(_user, song) ||
            !_user.historicEnabled
        ) return;

        const _song = await this.songService.getOrCreate(song);
        const updoc = await this.update(
            _user.id,
            {
                $push: { songs: _song }
            },
        );

        if (updoc) this.save(updoc.id, updoc);
    }
}