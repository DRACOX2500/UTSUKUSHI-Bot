export namespace Converter {
	/**
	 * @param durationString string
	 * @return `number | null` milliseconds number or null
	 * @Regex `^\d{1,2}$|^(\d{1,2}:){1,2}\d{1,2}$`
	 *
	 * Support Duration format :
	 * - only seconds `00`
	 * - minutes - seconds `00:00`
	 * - hours - minutes - seconds `00:00:00`
	 */
	export function durationStringToNumber(
		durationString: string
	): number | null {
		if (!durationString.match(/^\d{1,2}$|^(\d{1,2}:){1,2}\d{1,2}$/))
			return null;

		const time = durationString;
		const array = time.split(':');
		if (array.length === 0 || array.length > 3) return null;
		if (array.length === 1) return parseInt(array[0], 10) * 1000;
		if (array.length === 2)
			return parseInt(array[0], 10) * 60000 + parseInt(array[1], 10) * 1000;
		else
			return (
				parseInt(array[0], 10) * 3600000 +
				parseInt(array[1], 10) * 60000 +
				parseInt(array[2], 10) * 1000
			);
	}

	export function secondsToMinutesSecondsFormat(seconds: number): string {
		const min = Math.floor(seconds / 60);
		const sec = seconds % 60;

		function padTo2Digits(num: number) {
			return num.toString().padStart(2, '0');
		}
		return `${padTo2Digits(min)}:${padTo2Digits(sec)}`;
	}
}
