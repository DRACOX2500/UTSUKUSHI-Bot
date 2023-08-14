import { Guild } from "@/types/business";
import { AbstractStore } from "./abstract-store";

export class GuildStore extends AbstractStore<Guild[]> {

    constructor() {
        super(null as any, []);
    }
}