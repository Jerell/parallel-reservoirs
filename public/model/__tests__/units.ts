import {
	Temperature,
	TemperatureUnits,
	Pressure,
	PressureUnits,
} from 'physical-quantities'

describe('temperature', () => {
	it('should create a temperature from kelvin', () => {
		const temp = new Temperature(10, TemperatureUnits.Kelvin)

		expect(temp.celsius).toBe(-263.15)
		expect(temp.kelvin).toBe(10)
	})

	it('should create a temperature from celsius', () => {
		const temp = new Temperature(40, TemperatureUnits.Celsius)

		expect(temp.celsius).toBe(40)
		expect(temp.kelvin).toBe(313.15)
	})
})

describe('pressure', () => {
	it('should create a pressure from Pascal', () => {
		const pressure = new Pressure(10, PressureUnits.Pascal)

		expect(pressure.pascal).toBe(10)
		expect(pressure.bara).toBe(10e-5)
	})

	it('should create a pressure from Bara', () => {
		const pressure = new Pressure(1, PressureUnits.Bara)

		expect(pressure.pascal).toBe(100000)
		expect(pressure.bara).toBe(1)
	})
})
