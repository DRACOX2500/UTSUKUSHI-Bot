export function sortByName(a: string, b: string): number {
	const nameA = a.toUpperCase();
	const nameB = b.toUpperCase();
	if (nameA < nameB) {
		return -1;
	}
	if (nameA > nameB) {
		return 1;
	}

	// names must be equal
	return 0;
}
