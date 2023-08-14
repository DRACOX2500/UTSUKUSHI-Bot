import { Document, Model } from "mongoose";
import { Observable, BehaviorSubject } from "rxjs";

export class AbstractStore<T = any> {

    schema: Model<any>;

    private _data$: Observable<T>;
    private _dataSubject$: BehaviorSubject<T>;
    private _doc$: Observable<Document<any, any, T>>;
    private _docSubject$: BehaviorSubject<Document<any, any, T>>;

    constructor(schema: Model<any>, value: T) {
        this.schema = schema;
        this._dataSubject$ = new BehaviorSubject(value);
        this._data$ = this._dataSubject$.asObservable();
        this._docSubject$ = new BehaviorSubject({} as any);
        this._doc$ = this._docSubject$.asObservable();
    }

    protected setDoc(doc: Document<any, any, T>): void {
        this._docSubject$.next(doc);
    }

    async init(value: T) {
        this._dataSubject$.next(value);
    }

    get value(): T {
        return this._dataSubject$.value;
    }

    get value$(): Observable<T> {
        return this._data$;
    }

    get doc(): Document<any, any, T> {
        return this._docSubject$.value;
    }

    get doc$(): Observable<Document<any, any, T>> {
        return this._doc$;
    }
}