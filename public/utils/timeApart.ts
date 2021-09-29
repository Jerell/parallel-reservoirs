export default function timeApart(d1: Date, d2: Date, step: number) {
	const diffDays = Math.round(Math.abs((d1.getTime() - d2.getTime()) / step));
	return diffDays;
}

export function daysApart(d1: Date, d2: Date) {
	const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	return timeApart(d1, d2, oneDay);
}

export function weeksApart(d1: Date, d2: Date) {
	const oneWeek = 7 * 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	return timeApart(d1, d2, oneWeek);
}

export function monthsApart(d1: Date, d2: Date) {
	const oneMonth = 30 * 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
	return timeApart(d1, d2, oneMonth);
}
