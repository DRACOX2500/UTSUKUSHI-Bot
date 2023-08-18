import { Model } from "mongoose";
import { Observable, BehaviorSubject } from "rxjs";

export class AbstractStore<T = any> {

    schema: Model<T>;

    private _data$: Observable<T>;
    private _dataSubject$: BehaviorSubject<T>;

    constructor(schema: Model<any>, value: T) {
        this.schema = schema;
        this._dataSubject$ = new BehaviorSubject(value);
        this._data$ = this._dataSubject$.asObservable();
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
}