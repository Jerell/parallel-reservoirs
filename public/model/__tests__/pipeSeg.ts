import PipeSeg from '../pipeSeg'

describe('constructor', () => {
	it('should accept an array of diameters', () => {
		const p = new PipeSeg({ diameters: [2, 3, 4] })
		expect(p.diameters).toEqual([2, 3, 4])
	})

	it('should calculate an effective area (1)', () => {
		const p = new PipeSeg({ diameters: [2, 3, 4] })
		expect(p.effectiveArea).toBe(22.776546738526)
	})

	it('should calculate an effective area (2)', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })
		expect(p.effectiveArea).toBe(2.356194490192345)
	})

	it('should calculate an effective area (3)', () => {
		const p = new PipeSeg({ diameters: [1] })
		expect(p.effectiveArea).toBe(0.7853981633974483)
	})

	it('should have a default x value of 0', () => {
		const p = new PipeSeg({ diameters: [1] })
		expect(p.properties.start.x).toBe(0)
	})

	it('should have a default y value of 0', () => {
		const p = new PipeSeg({ diameters: [1] })
		expect(p.properties.start.x).toBe(0)
	})

	it('should set x', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1 } })
		expect(p.properties.start.x).toBe(1)
	})

	it('should set y', () => {
		const p = new PipeSeg({ diameters: [1], start: { y: 1312 } })
		expect(p.properties.start.y).toBe(1312)
	})

	it('should have a null source value', () => {
		const p = new PipeSeg({ diameters: [1] })
		expect(p.source).toBeNull()
	})

	it('should have a null destination', () => {
		const p = new PipeSeg({ diameters: [1] })
		expect(p.destination).toBeNull()
	})
})

describe('removeLine', () => {
	it('should remove an element from this.diameters', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })

		p.removeLine(1)

		expect(p.diameters).toEqual([1, 1])
	})

	it('should throw an error if the specified size is not in this.diameters', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })

		expect(() => p.removeLine(2)).toThrow(/Pipe does not have a line of size/)
	})

	it('should throw an error if this.diameters has length 1', () => {
		const p = new PipeSeg({ diameters: [2] })

		expect(() => p.removeLine(2)).toThrow(/Pipe only has one line/)
	})

	it('should change the returned value of effectiveArea', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })

		const oldArea = p.effectiveArea
		p.removeLine(1)
		const newArea = p.effectiveArea

		expect(newArea).toBeLessThan(oldArea)
	})
})

describe('addLine', () => {
	it('should append a number to this.diameters', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })

		p.addLine(2)

		expect(p.diameters).toContain(2)
	})

	it('should change the returned value of effectiveArea', () => {
		const p = new PipeSeg({ diameters: [1, 1, 1] })

		p.addLine(2)

		expect(p.effectiveArea).toBe(5.497787143782138)
	})
})

describe('destinations', () => {
	it('should add a destination pipe', () => {
		const p = new PipeSeg({ diameters: [1] })
		const q = new PipeSeg({ diameters: [1] })

		p.setDestination(q)

		expect(p.destination).toBe(q)
	})

	it('should set the source of the destination pipe', () => {
		const p = new PipeSeg({ diameters: [1] })
		const q = new PipeSeg({ diameters: [1] })

		p.setDestination(q)

		expect(q.source).toBe(p)
	})

	it('should update in pressure of destination (1/3)', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { pressure: 100000, temperature: 300 },
			flowrate: 150,
		})
		const q = new PipeSeg({
			diameters: [0.9144],
			start: {
				x: 200,
			},
		})

		p.setDestination(q)

		expect(q.properties.start.pressure).toBe(61111.81128965647)
	})

	it('should update in pressure of destination (2/3)', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const q = new PipeSeg({
			diameters: [0.9144],
			start: {
				x: 200,
			},
		})

		p.setDestination(q)

		expect(q.properties.start.pressure).toBe(294535.73943407804)
	})

	it('should update flowrate of destination', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const q = new PipeSeg({
			diameters: [0.9144],
			start: {
				x: 200,
			},
		})

		p.setDestination(q)

		expect(q.properties.flowrate).toBe(100)
	})
})

describe('length', () => {
	it('should return the distances from (this.x, this.y) to (dest.x, dest.y) (1)', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		p.setDestination(q)

		expect(p.length).toEqual(5)
	})

	it('should return the distances from (this.x, this.y) to (dest.x, dest.y) (2)', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 7, y: 9 } })

		p.setDestination(q)

		expect(p.length).toEqual(10)
	})
})

describe('height', () => {
	it('should return the y differences to each destination (1)', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		p.setDestination(q)

		expect(p.height).toEqual(4)
	})

	it('should return the y differences to each destination (2)', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 7, y: 9 } })

		p.setDestination(q)

		expect(p.height).toEqual(8)
	})
})

describe('endPressure', () => {
	it('should return zero when the flowrate is too high', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { pressure: 100000, temperature: 300 },
			flowrate: 200,
		})
		const q = new PipeSeg({
			diameters: [0.9144],
			start: {
				x: 200,
			},
		})

		p.setDestination(q)

		expect(p.endPressure()).toBe(0)
	})
})
