import FluidProperties, { Phase, PhaseData } from '../fluidProperties'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from '../units'
import { FakePhaseEnvelopeFileReader } from './fakePhaseFileReader'

describe('fluid phase', () => {
	const phaseData = new PhaseData([
		[9.84899329, 6857338.64, 4811526.12],
		[10.0671141, 6871319.86, 4838929.93],
	])

	const testCases = [
		{
			temperature: 10,
			pressure: 10,
			phase: Phase.Gas,
		},
		{
			temperature: 10,
			pressure: 100,
			phase: Phase.Liquid,
		},
		{
			temperature: 10,
			pressure: 50,
			phase: Phase.TwoPhase,
		},
	]

	testCases.forEach((test) => {
		it('should calculate phase', async () => {
			const fluidProperties = new FluidProperties(
				new FakePhaseEnvelopeFileReader(phaseData)
			)

			return await fluidProperties
				.phase(
					new Pressure(test.pressure, PressureUnits.Bara),
					new Temperature(test.temperature, TemperatureUnits.Celsius)
				)
				.then((phase) => {
					expect(phase).toBe(test.phase)
				})
		})
	})
})
