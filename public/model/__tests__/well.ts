import Well from '../well'
import Reservoir from '../reservoir'
import { defaultFluidConstructor } from '../fluid'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'
import { RealReservoir } from '../reservoir'
import PipeSeg from '../pipeSeg'

describe('endPressure', () => {
	it('should match the predicted value from python', async () => {
		const fluid = await defaultFluidConstructor(
			new Pressure(60, PressureUnits.Bara),
			new Temperature(300, TemperatureUnits.Kelvin),
			30
		)

		const pipe = new PipeSeg({
			name: 'pipe',
			length: 1,
			diameters: [16, 14, 12],
			elevation: 1,
		})
		const well = new Well('HM1', { elevation: 0 }, RealReservoir.Hamilton)
		well.source = pipe
		const reservoir = new Reservoir('Hamilton', { elevation: 0 }, 10)
		well.setDestination(reservoir)
		well.process(fluid)

		const predictedValue = 81.01817 // bara

		expect(well.endPressure()).toBeCloseTo(predictedValue)
	})
})
