/* eslint-disable @typescript-eslint/no-namespace */
export namespace Sort {
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
}
