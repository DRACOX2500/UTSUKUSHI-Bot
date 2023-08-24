import { ArrayUtils } from '../src/core/utils/array';
import { ConverterUtils } from '../src/core/utils/converter';
import { GetterUtils } from '../src/core/utils/getter';
import { SortUtils } from '../src/core/utils/sort';
import { describe, expect, test } from '@jest/globals';

describe('Utils', () => {
	test('Array - Remove Duplicate', () => {
		const list = ['a', 'a', 'b'];
		const res = ArrayUtils.removeDuplicate(list);
		expect(res).toEqual(['a', 'b']);
	});

	test('Convert - Seconds To Minutes-Seconds Format', () => {
		expect(ConverterUtils.secondsToMinutesSecondsFormat(80)).toBe('01:20');
	});

	test('Convert - Date To Format', () => {
		const date = new Date(0);
		expect(ConverterUtils.dateToFormat(date)).toEqual('01/00/1970 01:00');
	});

	test('Convert - Duration String To Number', () => {
		expect(ConverterUtils.durationStringToNumber('24:00:00')).toEqual(86400000);
	});

	test('Getter - Random Number', () => {
		const number = GetterUtils.randomNumber(9);
		expect(number).toBeLessThanOrEqual(9);
		expect(number).toBeGreaterThanOrEqual(0);
	});

	test('Getter - URL Query Param', () => {
		const url = 'https://www.example.com/home?t=5200&name=test&query=search';
		expect(GetterUtils.urlQueryParam(url, 't')).toEqual('5200');
		expect(GetterUtils.urlQueryParam(url, 'name')).toEqual('test');
		expect(GetterUtils.urlQueryParam(url, 'query')).toEqual('search');
	});

	test('Sort - By Name', () => {
		const array = ['xyz', 'hij', 'mno', 'abd'];
		array.sort((a: string, b: string) => SortUtils.byName(a, b));
		expect(array).toStrictEqual(['abd', 'hij', 'mno', 'xyz']);
	});

	test('Sort - By Date', () => {
		const first = new Date(0);
		const now = new Date();
		const array = [first, now];
		array.sort((a: Date, b: Date) => SortUtils.byDate(a, b));
		expect(array).toStrictEqual([now, first]);
	});

	test('Sort - By Starts With', () => {
		const array = ['aaa', 'aab', 'bbb'];
		array.sort((a: string, b: string) => SortUtils.byStartsWith(a, b, 'b'));
		expect(array).toStrictEqual(['bbb', 'aaa', 'aab']);
	});
});
