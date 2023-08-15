import { AbstractStore } from "./abstract-store";

export class AbstractRecordStore<T = any> extends AbstractStore<Record<string, T>> {

    save(id: string, value: T) {
        const record = this.value
        record[id] = value;
        this.set(record);
    }

    remove(id: string) {
        const record = this.value
        delete record[id];
        this.set(record);
    }
}