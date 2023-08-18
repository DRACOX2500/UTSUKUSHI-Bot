import { BehaviorSubject } from "rxjs";

export class Starter {

    private record: BehaviorSubject<Record<string, boolean>>

    constructor(value: string[], onReady: () => void) {
        this.record = new BehaviorSubject(this.toRecord(value));
        this.record
        // .pipe(takeWhile(() => this.isAllChecked))
        .subscribe((res) => {
            if (this.isAllChecked) onReady();
        })
    }

    private toRecord(list: string[]): Record<string, boolean> {
        const _rec: Record<string, boolean> = {}
        list.forEach(item => _rec[item] = false);
        return _rec;
    }

    private get isAllChecked(): boolean {
        let checkedCount = 0;
        for (const key in this.record.value) {
            if (this.record.value[key]) checkedCount++;
        }
        return checkedCount === this.length;
    }

    private get length(): number {
        let size = 0;
        for (const key in this.record.value) {
            size++;
        }
        return size;
    }

    check(key: keyof typeof this.record.value) {
        const _rec = this.record.value;
        _rec[key] = true;
        this.record.next(_rec);
    }
}