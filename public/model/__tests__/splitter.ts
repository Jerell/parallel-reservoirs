import Splitter from '../splitter'
import PipeSeg from '../pipeSeg'
import { defaultFluidConstructor } from '../fluid'
import FakeReservoir from './fakeReservoir'
import Reservoir from '../reservoir'
import { PressureSolution } from '../element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

// describe('searchBranchFlowrate', async () => {
// 	const pipeseg1 = new PipeSeg({
// 		length: 5,
// 		diameters: [0.9144],
// 		elevation: 1,
// 		name: 'pipe1',
// 	})
// 	const pipeseg2 = new PipeSeg({
// 		length: 200,
// 		diameters: [0.9144],
// 		elevation: 1,
// 		name: 'pipe2',
// 	})
// 	const pipeseg3 = new PipeSeg({
// 		length: 200,
// 		diameters: [0.9144],
// 		elevation: 1,
// 		name: 'pipe2',
// 	})
// 	const pipeseg4 = new PipeSeg({
// 		length: 200,
// 		diameters: [0.9144],
// 		elevation: 1,
// 		name: 'pipe2',
// 	})
// 	pipeseg3.setDestination(pipeseg4)

// 	const splitter = new Splitter(pipeseg1, { elevation: 1 }, 'splitter')
// 	splitter.setDestinations([pipeseg2, pipeseg3])

// 	const reservoir1 = new Reservoir('Reservoir1', { elevation: 1 }, 10)
// 	const reservoir2 = new Reservoir('Reservoir2', { elevation: 1 }, 10)

// 	pipeseg2.setDestination(reservoir1)
// 	pipeseg3.setDestination(reservoir2)

// 	const result = await pipeseg1.process(
// 		await defaultFluidConstructor(
// 			new Pressure(300000, PressureUnits.Pascal),
// 			new Temperature(350, TemperatureUnits.Kelvin),
// 			100
// 		)
// 	)

// 	it('should return a value that produces the correct end pressure', () => {
// 		expect(reservoir1.fluid.pressure).toBeCloseTo(reservoir1.pressure)
// 		expect(reservoir2.fluid.pressure).toBeCloseTo(reservoir2.pressure)
// 		expect(result).toBe(PressureSolution.Ok)
// 	})
// })
