import Fluid from '../fluid'

describe('viscosity', () => {
	it('should look up the correct viscosity for a given pressure and temperature', () => {
		const fluid = new Fluid(10000, -5, 10)

		const viscosity = fluid.viscosity()

		expect(viscosity).toBe(1)
	})
})
