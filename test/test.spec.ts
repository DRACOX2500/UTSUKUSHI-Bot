/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// TEST

import { Converter } from '@utils/converter';
import { Getter } from '@utils/getter';
import { UtsukushiClient } from 'src/utsukushi-client';

export const client = new UtsukushiClient(true);

describe('Utils Module', () => {

	test('Random Int [0-9]', () => {
		const number = Getter.randomNumber(9);
		expect(number).toBeLessThanOrEqual(9);
		expect(number).toBeGreaterThanOrEqual(0);
	});

	test('Seconds To Minute/Secondes Format', () => {
		expect(Converter.secondsToMinutesSecondsFormat(90)).toBe('01:30');
	});

	test('Convert 24h string into milliseconds number', () => {
		expect(Converter.durationStringToNumber('24:00:00')).toBe(86400000);
	});
});