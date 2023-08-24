export namespace Array {
	export function removeDuplicate<T = any>(list: T[]): T[] {
		return list.filter((item, index) => list.indexOf(item) === index);
	}
	export function limit<T = any>(list: T[], limit: number, start: number = 0): T[] {
		if (list.length >= limit) return list.slice(start, start + limit);
		return list;
	}
}