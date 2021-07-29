import Reservoir from '../reservoir'

describe('constructor', () => {
	it('should have the specified volume', () => {
		const r = new Reservoir({ volume: 10 })
		expect(r.volume).toBe(10)
	})

	it('should have an inflow of zero', () => {
		const r = new Reservoir({ volume: 10 })
		expect(r.inflow).toBe(0)
	})

	it('should have a volume of zero', () => {
		const r = new Reservoir({ volume: 10 })
		expect(r.amount).toBe(0)
	})
})

describe('getPressure', () => {
	it('should be zero when amount is zero', () => {
		const r = new Reservoir({ volume: 10 })
		expect(r.getPressure()).toBe(0)
	})
})
