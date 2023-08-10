import { Guild } from "discord.js";
import { BehaviorSubject, Observable } from "rxjs";

export class GuildStore {

    private _guilds$: Observable<Guild[]>;
    private _guildsSubject$: BehaviorSubject<Guild[]>;

    constructor() {
        const list: Guild[] = [];
        this._guildsSubject$ = new BehaviorSubject(list);
        this._guilds$ = this._guildsSubject$.asObservable();
    }

    init() {
        //TODO: get from database
        const list: Guild[] = [];
        this._guildsSubject$.next(list);
    }

    get guilds(): Guild[] {
        return this._guildsSubject$.value;
    }

    get guilds$(): Observable<Guild[]> {
        return this._guilds$;
    }
}