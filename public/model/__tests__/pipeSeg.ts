import PipeSeg from '../pipeSeg'
import Fluid, { defaultFluidConstructor } from '../fluid'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

describe('effectiveArea', () =>
	it('should calculate the effectiveArea', () => {
		const pipeseg = new PipeSeg({
			length: 1,
			diameters: [16, 14, 12],
			elevation: 1,
			name: 'pipe',
		})

		expect(pipeseg.effectiveArea).toBeCloseTo(468.097305385)
	}))

describe('removeLine', () =>
	it('should change the returned value of effectiveArea', () => {
		const pipeseg = new PipeSeg({
			length: 1,
			diameters: [16, 14, 12],
			elevation: 1,
			name: 'pipe',
		})

		pipeseg.removeLine(14)
		const newArea = pipeseg.effectiveArea

		expect(newArea).toBeCloseTo(314.159265359)
	}))

describe('addLine', () => {
	it('should change the returned value of effectiveArea', () => {
		const pipeseg = new PipeSeg({
			length: 1,
			diameters: [1, 1, 1],
			elevation: 1,
			name: 'pipe',
		})

		pipeseg.addLine(2)

		expect(pipeseg.effectiveArea).toBe(5.497787143782138)
	})
})

describe('destinations', () => {
	const pipeseg1 = new PipeSeg({
		length: 200,
		diameters: [0.9144],
		elevation: 1,
		name: 'pipe1',
	})
	const pipeseg2 = new PipeSeg({
		length: 1,
		diameters: [0.9144],
		elevation: 1,
		name: 'pipe2',
	})
	pipeseg1.setDestination(pipeseg2)

	it('should add a destination pipe', () => {
		expect(pipeseg1.destination).toBe(pipeseg2)
	})

	it('should set the source of the destination pipe', () => {
		expect(pipeseg2.source).toBe(pipeseg1)
	})

	const pressureTestCases = [
		{
			pressure: 100000,
			temperature: 300,
			flowrate: 150,
			p2: 60430.923108175855,
		},
		{
			pressure: 300000,
			temperature: 350,
			flowrate: 100,
			p2: 294535.73943407804,
		},
	]

	test.each(pressureTestCases)(
		'should update in pressure of destination',
		async ({ pressure, temperature, flowrate, p2 }) => {
			const fluid = await defaultFluidConstructor(
				new Pressure(pressure, PressureUnits.Pascal),
				new Temperature(temperature, TemperatureUnits.Kelvin),
				flowrate
			)
			return await pipeseg1.process(fluid).then(() => {
				expect(pipeseg2.fluid.pressure).toBe(p2)
			})
		}
	)

	const flowrateTestCases = [
		{
			pressure: 100000,
			temperature: 300,
			flowrate: 150,
		},
		{
			pressure: 300000,
			temperature: 350,
			flowrate: 100,
		},
	]

	test.each(pressureTestCases)(
		'should update flowrate of destination',
		async ({ pressure, temperature, flowrate }) => {
			const fluid = await defaultFluidConstructor(
				new Pressure(pressure, PressureUnits.Pascal),
				new Temperature(temperature, TemperatureUnits.Kelvin),
				flowrate
			)
			return await pipeseg1.process(fluid).then(() => {
				expect(pipeseg2.fluid.flowrate).toBe(flowrate)
			})
		}
	)
})

describe('height', () => {
	it('should return the y differences to destination (1)', async () => {
		const pipeseg1 = new PipeSeg({
			length: 1,
			diameters: [1],
			elevation: 1,
			name: 'pipe',
		})
		const pipeseg2 = new PipeSeg({
			length: 1,
			diameters: [1],
			elevation: 10,
			name: 'pipe',
		})
		pipeseg1.setDestination(pipeseg2)

		expect(pipeseg1.height).toEqual(9)
	})
})

describe('endPressure', () => {
	it('should return zero when the flowrate is too high', async () => {
		const fluid = await defaultFluidConstructor(
			new Pressure(100000, PressureUnits.Pascal),
			new Temperature(300, TemperatureUnits.Kelvin),
			200
		)

		const pipeseg = new PipeSeg({
			length: 200,
			diameters: [0.9144],
			elevation: 1,
			name: 'pipe',
		})
		return await pipeseg.process(fluid).then(() => {
			expect(pipeseg.endPressure()).toBe(0)
		})
	})
})
