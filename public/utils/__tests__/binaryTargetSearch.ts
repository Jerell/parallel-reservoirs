import binaryTargetSearch from '../binaryTargetSearch';
import massToPressure from '../api/massToPressure';

describe('Search', () => {
	const testCases = [
		{
			domain: {
				min: 0,
				max: 10,
			},
			target: 5,
			precision: undefined,
			fn: undefined,
			expected: 5,
		},
		{
			domain: {
				min: 0,
				max: 10,
			},
			target: 5,
			precision: 1,
			fn: (n) => n + 1,
			expected: 4,
		},
		{
			domain: {
				min: 0,
				max: 10,
			},
			target: 2,
			precision: 0,
			fn: (n) => n / 2,
			expected: 4,
		},
		{
			domain: {
				min: 0,
				max: 10,
			},
			target: 2.5,
			precision: 1,
			fn: (n) => n / 2,
			expected: 5,
		},
		{
			domain: {
				min: 0,
				max: 10,
			},
			target: 9,
			precision: 1,
			fn: (n) => n ** 2,
			expected: 3,
		},
		{
			domain: {
				min: 0,
				max: 10e10,
			},
			target: 4.96,
			precision: 2,
			fn: (n) => massToPressure.HM(n, true),
			expected: 180053710.94,
		},
	];

	test.each(testCases)(
		'return expected',
		({ domain, target, precision, fn, expected }) => {
			expect(binaryTargetSearch(domain, target, precision, fn)).toEqual(
				expected
			);
		}
	);
});
