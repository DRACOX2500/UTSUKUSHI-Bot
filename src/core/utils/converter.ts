function padTo2Digits(num: number): string {
	return num.toString().padStart(2, '0');
}

const REGEX_DATE = /^\d{1,2}$|^(\d{1,2}:){1,2}\d{1,2}$/;

export namespace ConverterUtils {
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
		durationString: string,
	): number | null {
		if (!REGEX_DATE.exec(durationString)) return null;

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

		return `${padTo2Digits(min)}:${padTo2Digits(sec)}`;
	}

	export function convertMsToTime(milliseconds: number): string {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		seconds = seconds % 60;
		minutes = minutes % 60;

		return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
			seconds,
		)}`;
	}

	/**
	 * Return date into the following format:
	 * - `dd/mm/yyyy HH:MM`
	 */
	export function dateToFormat(date: Date): string {
		return `${padTo2Digits(date.getDate())}/${padTo2Digits(
			date.getMonth(),
		)}/${date.getFullYear()} ${padTo2Digits(date.getHours())}:${padTo2Digits(
			date.getMinutes(),
		)}`;
	}
}
