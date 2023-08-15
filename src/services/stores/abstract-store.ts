import { HydratedDocument, Model } from "mongoose";
import { Observable, BehaviorSubject } from "rxjs";

export class AbstractStore<T = any> {

    schema: Model<T>;

    private _data$: Observable<T>;
    private _dataSubject$: BehaviorSubject<T>;
    private _doc$: Observable<HydratedDocument<T>>;
    private _docSubject$: BehaviorSubject<HydratedDocument<T>>;

    constructor(schema: Model<any>, value: T) {
        this.schema = schema;
        this._dataSubject$ = new BehaviorSubject(value);
        this._data$ = this._dataSubject$.asObservable();
        this._docSubject$ = new BehaviorSubject({} as any);
        this._doc$ = this._docSubject$.asObservable();
    }

    protected setDoc(doc: HydratedDocument<T>): void {
        this._docSubject$.next(doc);
    }

    async set(value: T) {
        this._dataSubject$.next(value);
    }

    get value(): T {
        return this._dataSubject$.value;
    }

    get value$(): Observable<T> {
        return this._data$;
    }

    get doc(): HydratedDocument<T> {
        return this._docSubject$.value;
    }

    get doc$(): Observable<HydratedDocument<T>> {
        return this._doc$;
    }
}