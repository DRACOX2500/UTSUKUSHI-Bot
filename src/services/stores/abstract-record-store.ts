import logger from '../../core/logger';
import { AbstractStore } from './abstract-store';

interface Item<T> {
    item: T;
    date: Date,
}

const TIMER = 3600000;

export abstract class AbstractRecordStore<T = any> extends AbstractStore<Record<string, Item<T>>> {

	private readonly id: string;

	constructor(id?: `${string}-cache`) {
		super({});
		this.id = id ?? 'cache';
		setInterval(async () => { await this.clean(); }, TIMER);
	}

	private async clean(): Promise<void> {
		const NOW = new Date().getTime();
		const record = this.value;
		let count = 0;
		for (const key in record) {
			if (!record[key]) continue;
			if (NOW - record[key].date.getTime() > TIMER) {
				delete record[key];
			}
			else count++;
		}
		logger.info(`[Cache] ${this.id} clean (entries: ${count}) !`);
		await this.set(record);
	}

	protected save(id: string, value: T): T {
		const record = this.value;
		record[id] = {
			item: value,
			date: new Date(),
		};
		this.set(record);
		return value;
	}

	protected get(id: string): T | null {
		const item = this.value[id]?.item ?? null;
		if (item) {
			this.save(id, item);
		}
		return item;
	}

	protected remove(id: string): void {
		const record = this.value;
		delete record[id];
		this.set(record);
	}
}