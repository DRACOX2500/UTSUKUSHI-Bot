/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// TEST

import { Converter } from '@utils/converter';
import { Getter } from '@utils/getter';
import { Sort } from '@utils/sort';

describe('Utils Module', () => {

	test('Random Int [0-9]', () => {
		const number = Getter.randomNumber(9);
		expect(number).toBeLessThanOrEqual(9);
		expect(number).toBeGreaterThanOrEqual(0);
	});

	test('Get Query Param in URL', () => {
		const url = 'https://www.example.com/home?t=5200&name=test&query=search';
		expect(Getter.urlQueryParam(url, 'name')).toBe('test');
	});

	test('Seconds To Minute/Secondes Format', () => {
		expect(Converter.secondsToMinutesSecondsFormat(90)).toBe('01:30');
	});

	test('Convert 24h String Into Milliseconds Number', () => {
		expect(Converter.durationStringToNumber('24:00:00')).toBe(86400000);
	});

	test('Sort By Name', () => {
		const array = ['xyz', 'hij', 'mno', 'abd'];
		array.sort((a: string, b: string) => Sort.byName(a, b));
		expect(array).toStrictEqual(['abd', 'hij', 'mno', 'xyz']);
	});
});