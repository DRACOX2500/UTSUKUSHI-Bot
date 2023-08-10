import { User } from "discord.js";
import { BehaviorSubject, Observable } from "rxjs";

export class UserStore {

    private _users$: Observable<User[]>;
    private _usersSubject$: BehaviorSubject<User[]>;

    constructor() {
        const list: User[] = [];
        this._usersSubject$ = new BehaviorSubject(list);
        this._users$ = this._usersSubject$.asObservable();
    }

    init() {
        //TODO: get from database
        const list: User[] = [];
        this._usersSubject$.next(list);
    }

    get users(): User[] {
        return this._usersSubject$.value;
    }

    get users$(): Observable<User[]> {
        return this._users$;
    }
}