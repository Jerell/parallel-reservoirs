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

describe('Test case', () => {
	test('from trello - 1 MTPA, all reservoirs 15 bar', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;
		const highPLim = new Pressure(35, PressureUnits.Bara);

		await inlet.applyInletProperties(
			highPLim.pascal,
			300,
			new Flowrate(1, FlowrateUnits.MTPA).kgps,
			true
		);

		const result = await inlet.searchInletPressure();

		expect(inlet).toBeInstanceOf(Inlet);
	});

	test('25 bar inlet', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		await inlet.applyInletProperties(
			new Pressure(25, PressureUnits.Bara).pascal,
			300,
			new Flowrate(1, FlowrateUnits.MTPA).kgps,
			true
		);

		const result = await inlet.process(inlet.fluid);

		expect(inlet).toBeInstanceOf(Inlet);
	});

	const gasPhaseTestCases = [
		{
			inletP: new Pressure(69, PressureUnits.Bara).pascal,
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps).kgps,
			// Need actual reservoir pressures for test case
			HM_P: new Pressure(10, PressureUnits.Bara).pascal,
			HN_P: new Pressure(10, PressureUnits.Bara).pascal,
			LX_P: new Pressure(10, PressureUnits.Bara).pascal,
		},
		{
			inletP: new Pressure(67.7, PressureUnits.Bara).pascal,
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps).kgps,
			// Need actual reservoir pressures for test case
			HM_P: new Pressure(10, PressureUnits.Bara).pascal,
			HN_P: new Pressure(10, PressureUnits.Bara).pascal,
			LX_P: new Pressure(10, PressureUnits.Bara).pascal,
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
				new Pressure(10, PressureUnits.Bara).pascal, // placeholder
				new Temperature(300, TemperatureUnits.Kelvin).kelvin,
				inletFlowrate,
				true
			);

			const result = inlet.searchInletPressure();

			expect(result).toEqual(inletP);
		}
	);
});

// describe('lennox', () => {
// 	it('should', async () => {
// 		const fluid = await defaultFluidConstructor(
// 			new Pressure(121.3, PressureUnits.Bara),
// 			new Temperature(300, TemperatureUnits.Kelvin),
// 			new Flowrate(2.77, FlowrateUnits.Kgps)
// 		)
// 		const lennox = new Well('lx', { elevation: 0 }, RealReservoir.Lennox)
// 		const perf = new Perforation('lx-p', { elevation: 0 }, RealReservoir.Lennox)
// 		lennox.setDestination(perf)

// 		lennox.process(fluid)
// 		// const f = lennox.formula()

// 		expect(true).toBe(true)
// 	})
// })
