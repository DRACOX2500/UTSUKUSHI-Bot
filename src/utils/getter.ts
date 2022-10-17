/* eslint-disable @typescript-eslint/no-namespace */
export namespace Getter {
	/**
	 * Get Random Number between 0 and max (default: 1)
	 */
	export function randomNumber(max = 1): number {
		return Math.floor(Math.random() * max);
	}

	export function urlQueryParam(url: string, query: string): string {
		const pair = url.split('?')[1].split('=');

		if (pair.length % 2 !== 0) return '';
		const m = new Map();
		for (let i = 0; i < pair.length; i += 2) {
			m.set(pair[i], pair[i + 1]);
		}
		return m.get(query);
	}
}
