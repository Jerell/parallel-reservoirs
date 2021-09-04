import Parser from '../../../parser';
import Fluid, { defaultFluidConstructor } from '../../../fluid';
import Inlet from '../../../inlet';
import Splitter from '../../../splitter';
import Well from '../../../well';
import Perforation from '../../../perforation';
import Reservoir, { RealReservoir } from '../../../reservoir';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

const fs = require('fs');

const stream = fs.createWriteStream(`${__dirname}/setQInletP.txt`, {
	flags: 'a',
});

describe('Test case', () => {
	test('1 MTPA, all reservoirs 40 bar', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;
		const highPLim = new Pressure(35, PressureUnits.Bara);

		await inlet.applyInletProperties(
			highPLim,
			new Temperature(300, TemperatureUnits.Kelvin),
			new Flowrate(1, FlowrateUnits.MTPA),
			true
		);

		await inlet.searchInletPressure();

		expect(inlet).toBeInstanceOf(Inlet);
	});

	test('25 bar inlet', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		await inlet.applyInletProperties(
			new Pressure(25, PressureUnits.Bara),
			new Temperature(300, TemperatureUnits.Kelvin),
			new Flowrate(1, FlowrateUnits.MTPA),
			true
		);

		const result = await inlet.process(inlet.fluid);

		expect(inlet).toBeInstanceOf(Inlet);
	});

	const gasPhaseTestCases = [
		{
			inletP: new Pressure(69, PressureUnits.Bara),
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps),
			// Need actual reservoir pressures for test case
			HM_P: new Pressure(10, PressureUnits.Bara),
			HN_P: new Pressure(10, PressureUnits.Bara),
			LX_P: new Pressure(10, PressureUnits.Bara),
		},
		{
			inletP: new Pressure(67.7, PressureUnits.Bara),
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps),
			// Need actual reservoir pressures for test case
			HM_P: new Pressure(10, PressureUnits.Bara),
			HN_P: new Pressure(10, PressureUnits.Bara),
			LX_P: new Pressure(10, PressureUnits.Bara),
		},
	];

	test.each(gasPhaseTestCases)(
		'return expected inlet flowrate',
		async ({ inletP, inletFlowrate, HM_P, HN_P, LX_P }) => {
			const parser = new Parser();
			parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
			await parser.build();
			const keyPoints = parser.keyPoints;

			const inlet = keyPoints[0] as Inlet;

			const HM = keyPoints[4] as Reservoir;
			const HN = keyPoints[7] as Reservoir;
			const LX = keyPoints[10] as Reservoir;

			HM.pressure = HM_P;
			HN.pressure = HN_P;
			LX.pressure = LX_P;

			await inlet.applyInletProperties(
				new Pressure(10, PressureUnits.Bara), // placeholder
				new Temperature(300, TemperatureUnits.Kelvin),
				inletFlowrate,
				true
			);

			const result = await inlet.searchInletPressure();

			expect(result).toEqual(inletP.pascal);
		}
	);
});

describe('hamilton', () => {
	it('manual', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/hm-only.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		const runQ = async (q) => {
			await inlet.applyInletProperties(
				new Pressure(1, PressureUnits.Bara),
				new Temperature(300, TemperatureUnits.Kelvin),
				new Flowrate(q, FlowrateUnits.Kgps),
				true
			);

			const { pressure, pressureSolution } = await inlet.searchInletPressure();

			stream.write(`${q} kg/s | ${pressure} Pa\n`);
		};

		for (let i = 1; i < 31; i++) {
			await runQ(i);
		}

		await runQ(0.1);
		await runQ(0.5);

		expect(true).toBe(true);
	});
});

describe('hamilton north', () => {
	it('manual', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/hn-only.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		const runQ = async (q) => {
			await inlet.applyInletProperties(
				new Pressure(1, PressureUnits.Bara),
				new Temperature(300, TemperatureUnits.Kelvin),
				new Flowrate(q, FlowrateUnits.Kgps),
				true
			);

			const { pressure, pressureSolution } = await inlet.searchInletPressure();

			stream.write(`${q} kg/s | ${pressure} Pa\n`);
		};

		for (let i = 1; i < 31; i++) {
			await runQ(i);
		}

		await runQ(0.1);
		await runQ(0.5);

		expect(true).toBe(true);
	});
});

describe('lennox', () => {
	it('manual', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/lx-only.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		const runQ = async (q) => {
			await inlet.applyInletProperties(
				new Pressure(1, PressureUnits.Bara),
				new Temperature(300, TemperatureUnits.Kelvin),
				new Flowrate(q, FlowrateUnits.Kgps),
				true
			);

			const { pressure, pressureSolution } = await inlet.searchInletPressure();

			stream.write(`${q} kg/s | ${pressure} Pa\n`);
		};

		for (let i = 1; i < 31; i++) {
			await runQ(i);
		}

		await runQ(0.1);
		await runQ(0.5);

		expect(true).toBe(true);
	});
});
