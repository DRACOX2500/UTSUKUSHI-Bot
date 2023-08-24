export namespace ArrayUtils {
	export function removeDuplicate<T = any>(list: T[]): T[] {
		return list.filter((item, index) => list.indexOf(item) === index);
	}
}