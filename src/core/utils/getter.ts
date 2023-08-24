export namespace GetterUtils {
	/**
	 * Get Random Number between 0 and max (default: 1)
	 */
	export function randomNumber(max = 1): number {
		return Math.floor(Math.random() * max);
	}

	export function urlQueryParam(url: string, query: string): string {
		const pair = url.split('?')[1].split('&');

		const m = new Map();
		for (let i = 0; i < pair.length; i++) {
			const array = pair[i].split('=');
			m.set(array[0], array[1]);
		}
		return m.get(query);
	}
}
