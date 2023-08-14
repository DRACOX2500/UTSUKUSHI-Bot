import { AbstractStore } from "./abstract-store";
import { UtsukushiSystem } from "@/types/business";
import { UserStore } from './user.store';
import { GuildStore } from "./guild.store";
import System from '@/database/schemas/system.schema';
import { DEFAULT_SYSTEM } from "@/constants";

export class UtsukushiStore extends AbstractStore<UtsukushiSystem> {

    readonly users: UserStore;
    readonly guilds: GuildStore ;

    constructor() {
        super(System, DEFAULT_SYSTEM);
        this.users = new UserStore();
        this.guilds = new GuildStore();
    }

    private async initDefault(): Promise<void> {
        const syst = new System(this.value);
        await syst.save();
    }

    async initialize() {
        const res = await this.schema.find().limit(1).exec();
        if (res.length === 0) await this.initDefault();
        super.init(res[0] ?? this.value);
        this.users.init([]);
        this.guilds.init([]);
    }
}