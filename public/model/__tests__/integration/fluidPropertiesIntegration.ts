import FluidProperties, { Phase } from '../../fluidProperties'
import { PhaseEnvelopeFileReader } from '../../phaseEnvelopeFileReader'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from '../../units'

describe('FluidProperties reads and processes an input file', () => {
	const filereader = new PhaseEnvelopeFileReader(
		`${__dirname}/phaseEnvelope.csv`
	)
	const fluidProperties = new FluidProperties(filereader)
	it('should read data from an input file and return the phase', async () => {
		return await fluidProperties
			.phase(
				new Pressure(10, PressureUnits.Bara),
				new Temperature(10, TemperatureUnits.Celsius)
			)
			.then((phase) => {
				expect(phase).toBe(Phase.Gas)
			})
	})
})
