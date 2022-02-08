import { ILineOptions, LineGraph } from './LineGraph';
import {
	Pressure,
	Temperature,
	PressureUnits,
	TemperatureUnits,
} from 'physical-quantities';

interface IPTGraphProps {
	lines?: [number, number][][];
	stepped?: boolean;
	fixedLines?: {
		x?: number[] | Date[];
		y?: number[];
	};
	userBoundaries?: {
		x?: number[] | Date[];
		y?: number[];
	};
	click?: boolean;
	lineOptions?: ILineOptions[];
	userBoundaryOptions?: { x?: ILineOptions[]; y?: ILineOptions[] };
}

export const PTGraph = ({
	lines = [],
	stepped = false,
	fixedLines,
	userBoundaries,
	click = true,
	lineOptions = [],
	userBoundaryOptions = { x: [], y: [] },
}: IPTGraphProps) => {
	const display = {
		p: (n) => new Pressure(n, PressureUnits.Pascal).bara,
		t: (n) => new Temperature(n, TemperatureUnits.Kelvin).celsius,
	};

	const phaseBoundaryFunctions = {
		gasTwoPhase: (t_k) =>
			new Pressure(
				1327.08304 * t_k ** 2 - 617820.32694 * t_k + 7.34493e7,
				PressureUnits.Pascal
			).bara,

		denseTwoPhase: (t_k) =>
			new Pressure(
				802.9917953 * t_k ** 2 - 393819.35383 * t_k + 5.39853e7,
				PressureUnits.Pascal
			).bara,
	};

	const getLineForRange = (
		f: (n) => number,
		start: number,
		end: number,
		steps: number
	): [number, number][] => {
		const range = end - start;
		const interval = range / steps;

		const coord = (i: number): [number, number] => {
			const x = start + interval * i;
			const y = f(x);
			return [display.t(x), y];
		};

		const coords: [number, number][] = [];
		for (let i = 0; i <= steps; i++) {
			coords.push(coord(i));
		}
		return coords;
	};

	const phaseBoundaries = {
		gas: getLineForRange(
			phaseBoundaryFunctions.gasTwoPhase,
			new Temperature(273, TemperatureUnits.Kelvin).kelvin,
			new Temperature(302, TemperatureUnits.Kelvin).kelvin,
			15
		),
		dense: getLineForRange(
			phaseBoundaryFunctions.denseTwoPhase,
			new Temperature(273, TemperatureUnits.Kelvin).kelvin,
			new Temperature(302, TemperatureUnits.Kelvin).kelvin,
			15
		),
	};

	return (
		<div className='flex relative h-96 w-full'>
			<LineGraph
				lines={lines}
				gasPhaseBoundary={phaseBoundaries.gas}
				densePhaseBoundary={phaseBoundaries.dense}
				stepped={stepped}
				fixedLines={fixedLines}
				hover={{ x: true, y: true }}
				click={click}
				range={{
					x: {
						min: display.t(273),
						max: display.t(333),
					},
					y: {
						min: display.p(0),
						max: display.p(14000000),
					},
				}}
				xAxisLabel='temperature (°C)'
				yAxisLabel='pressure (bara)'
				lineOptions={lineOptions}
				userBoundaries={userBoundaries}
				userBoundaryOptions={userBoundaryOptions}
			/>
		</div>
	);
};

export class PT {
	pressure: Pressure;
	temperature: Temperature;

	constructor(pressure: Pressure, temperature: Temperature) {
		this.pressure = pressure;
		this.temperature = temperature;
	}
}

export class FromTo {
	start: PT;
	end: PT;

	constructor(start: PT, end: PT) {
		this.start = start;
		this.end = end;
	}

	getLine() {
		return [this.start, this.end].map((pt) => [
			pt.temperature.celsius,
			pt.pressure.bara,
		]) as [number, number][];
	}

	setTemperature(pos: 'start' | 'end', tempC?: number, tempK?: number) {
		if (tempK) tempC = new Temperature(tempK, TemperatureUnits.Kelvin).celsius;
		const newT = new Temperature(tempC!, TemperatureUnits.Celsius);
		switch (pos) {
			case 'start':
				this.start.temperature = newT;
				break;
			case 'end':
				this.end.temperature = newT;
				break;
		}
	}

	setPressure(pos: 'start' | 'end', pBar: number) {
		const newP = new Pressure(pBar, PressureUnits.Bara);
		switch (pos) {
			case 'start':
				this.start.pressure = newP;
				break;
			case 'end':
				this.end.pressure = newP;
				break;
		}
	}
}
