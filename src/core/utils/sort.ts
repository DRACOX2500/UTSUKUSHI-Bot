export namespace SortUtils {
	export function byName(a: string, b: string): number {
		const nameA = a.toUpperCase();
		const nameB = b.toUpperCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	}

	export function byStartsWith(a: string, b: string, start: string): number {
		return +b.startsWith(start) - +a.startsWith(start);
	}

	export function byDate(a: Date, b: Date): number {
		return b.getTime() - a.getTime();
	}
}
