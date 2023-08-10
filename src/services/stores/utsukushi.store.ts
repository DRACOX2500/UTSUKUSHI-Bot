import { Guild } from "discord.js";
import { BehaviorSubject, Observable } from "rxjs";

export class UtsukushiStore {

    private _config$: Observable<any>;
    private _configSubject$: BehaviorSubject<any>;

    constructor() {
        this._configSubject$ = new BehaviorSubject({});
        this._config$ = this._configSubject$.asObservable();
    }

    init() {
        //TODO: get from database
        const value = {};
        this._configSubject$.next(value);
    }

    get config(): Guild[] {
        return this._configSubject$.value;
    }

    get config$(): Observable<Guild[]> {
        return this._config$;
    }
}