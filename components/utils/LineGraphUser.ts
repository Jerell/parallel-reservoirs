export default class LineGraphUser {
	lines: [number | Date, number][][];
	fixedLines: {
		x: number[];
		y: number[];
	};

	constructor() {
		this.lines = [];
		this.fixedLines = {
			x: [],
			y: [],
		};
	}

	addFixed(axis: 'x' | 'y', value: number) {
		this.fixedLines[axis].push(value);
	}
}
