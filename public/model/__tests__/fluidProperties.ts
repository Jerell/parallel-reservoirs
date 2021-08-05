import FluidProperties, { Phase, PhaseData } from '../fluidProperties'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from '../units'

describe('fluid properties', () => {
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
		it('should calculate phase', () => {
			const fluidProperties = new FluidProperties(phaseData)

			const phase = fluidProperties.phase(
				new Pressure(test.pressure, PressureUnits.Bara),
				new Temperature(test.temperature, TemperatureUnits.Celsius)
			)

			expect(phase).toBe(test.phase)
		})
	})
})
