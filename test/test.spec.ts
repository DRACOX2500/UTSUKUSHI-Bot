/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
// TEST

import { getRandomInt } from '@utils/getRandomInt';
import { BotClient } from 'src/BotClient';
import { minuteSecondsFormater } from '@utils/secondsToMinuteSecondsFormat';
import { durationStringToNumber } from '@utils/durationStringToNumber';

export const client = new BotClient(true);

describe('Utils Module', () => {

	test('Random Int [0-9]', () => {
		const number = getRandomInt(9);
		expect(number).toBeLessThanOrEqual(9);
		expect(number).toBeGreaterThanOrEqual(0);
	});

	test('Seconds To Minute/Secondes Format', () => {
		expect(minuteSecondsFormater(90)).toBe('01:30');
	});

	test('Convert 24h string into milliseconds number', () => {
		expect(durationStringToNumber('24:00:00')).toBe(86400000);
	});
});