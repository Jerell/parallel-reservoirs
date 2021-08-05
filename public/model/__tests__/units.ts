import { Temperature, TemperatureUnits } from '../units'

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
	it('should', () => {})
})
