import { AbstractStore } from "./abstract-store";
import { UtsukushiSystem } from "@/types/business";
import { UserStore } from './user.store';
import { GuildStore } from "./guild.store";
import { SystemModel } from '@/database/schemas/system.schema';
import { BOT_EVENTS, DEFAULT_SYSTEM } from "@/constants";
import { BotActivity } from "@/core/types/business";
import { PresenceStatusData } from "discord.js";
import { UtsukushiBotClient } from "@/bot/client";

export class UtsukushiStore extends AbstractStore<UtsukushiSystem> {

    readonly users: UserStore;
    readonly guilds: GuildStore ;

    readonly clipboard: Record<string, any> ;

    constructor() {
        super(SystemModel, DEFAULT_SYSTEM);
        this.clipboard = {};
        this.users = new UserStore();
        this.guilds = new GuildStore();
    }

    private async initDefault(): Promise<void> {
        const systDoc = new SystemModel(this.value);
        await systDoc.save();
    }

    async initialize(client: UtsukushiBotClient) {
        const res = await this.schema.find().limit(1).exec();
        if (res.length === 0) await this.initDefault();
        super.set(res[0] ?? this.value);
        this.users.set({});
        this.guilds.set({});
        client.emit(BOT_EVENTS.STORE_INIT);
    }

    async updateActivity(activity: BotActivity) {
        const doc: any = await this.schema.find().limit(1).exec();
        const updoc = await SystemModel.findByIdAndUpdate(
            doc._id,
            {
                activity,
            },
            { new: true }
        )
        // .populate('emojis')
        // .populate('soundEffects')
        .exec();
        this.set(updoc as UtsukushiSystem);
    }

    async updateStatus(status: PresenceStatusData) {
        const doc: any = await this.schema.find().limit(1).exec();
        const updoc = await SystemModel.findByIdAndUpdate(
            doc._id,
            {
                status,
            },
            { new: true }
        )
        // .populate('emojis')
        // .populate('soundEffects')
        .exec();
        this.set(updoc as UtsukushiSystem);
    }
}