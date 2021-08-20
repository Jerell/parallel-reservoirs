import Well, { RealWell } from '../well'
import Reservoir from '../reservoir'
import { defaultFluidConstructor } from '../fluid'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

describe('endPressure', () => {
	it('should', async () => {
		const fluid = await defaultFluidConstructor(
			new Pressure(60, PressureUnits.Bara),
			new Temperature(300, TemperatureUnits.Kelvin),
			30
		)

		const well = new Well('HM1', { elevation: 0 }, RealWell.Hamilton)
		const reservoir = new Reservoir('Hamilton', { elevation: 0 }, 10)
		well.setDestination(reservoir)
		well.process(fluid)

		const predictedValue = 81.01817 // bara

		expect(well.endPressure()).toBeCloseTo(predictedValue)
	})
})
