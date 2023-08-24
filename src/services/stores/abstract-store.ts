import { type Observable, BehaviorSubject } from 'rxjs';

export abstract class AbstractStore<T = any> {

	private readonly _data$: Observable<T>;
	private readonly _dataSubject$: BehaviorSubject<T>;

	constructor(value: T) {
		this._dataSubject$ = new BehaviorSubject(value);
		this._data$ = this._dataSubject$.asObservable();
	}

	protected async set(value: T): Promise<void> {
		this._dataSubject$.next(value);
	}

	protected get value(): T {
		return this._dataSubject$.value;
	}

	protected get value$(): Observable<T> {
		return this._data$;
	}
}