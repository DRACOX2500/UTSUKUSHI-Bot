import { User } from "@/types/business";
import { User as UserDJS } from 'discord.js';
import { UserModel } from "@/database/schemas/user.schema";
import { AbstractRecordStore } from "./abstract-record-store";

export class UserStore extends AbstractRecordStore<User> {

    constructor() {
        super(UserModel, {});
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
}