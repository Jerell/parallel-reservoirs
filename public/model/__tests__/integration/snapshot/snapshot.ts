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

	test('53 bar inlet', async () => {
		const parser = new Parser();
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`);
		await parser.build();
		const keyPoints = parser.keyPoints;

		const inlet = keyPoints[0] as Inlet;

		await inlet.applyInletProperties(
			new Pressure(53.125, PressureUnits.Bara),
			new Temperature(50, TemperatureUnits.Celsius),
			new Flowrate(4.5, FlowrateUnits.MTPA),
			true
		);

		const result = await inlet.process(inlet.fluid);

		expect(inlet).toBeInstanceOf(Inlet);
	});

	const gasPhaseTestCases = [
		{
			inletP: new Pressure(69.4140625, PressureUnits.Bara),
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps),
			HM_P: new Pressure(40.7, PressureUnits.Bara),
			HN_P: new Pressure(35.5, PressureUnits.Bara),
			LX_P: new Pressure(37.4, PressureUnits.Bara),
		},
		{
			inletP: new Pressure(67.9208984375, PressureUnits.Bara),
			inletFlowrate: new Flowrate(150.3, FlowrateUnits.Kgps),
			HM_P: new Pressure(35.5, PressureUnits.Bara),
			HN_P: new Pressure(30.7, PressureUnits.Bara),
			LX_P: new Pressure(32.2, PressureUnits.Bara),
		},
	];

	test.each(gasPhaseTestCases)(
		'return expected inlet pressure',
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
				new Temperature(50, TemperatureUnits.Celsius),
				inletFlowrate,
				true
			);

			const result = await inlet.searchInletPressure();

			expect(result.pressure).toEqual(inletP);
		}
	);
});
