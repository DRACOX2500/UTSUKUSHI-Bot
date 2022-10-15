export function getUrlQueryParam(url: string, query: string): string {
	const pair = url.split('?')[1].split('=');

	if (pair.length % 2 !== 0) return '';
	const m = new Map();
	for (let i = 0; i < pair.length; i += 2) {
		m.set(pair[i], pair[i + 1]);
	}
	return m.get(query);
}
