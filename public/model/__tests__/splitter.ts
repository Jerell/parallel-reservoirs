import Splitter from '../splitter'
import PipeSeg from '../pipeSeg'

describe('constructor', () => {
	it('should accept a source', () => {
		const p = new PipeSeg({ diameters: [1] })
		const d = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const s = new Splitter({ source: p, destinations: [d] })

		expect(s.source).toBe(p)
	})

	it('should set the destination of the source', () => {
		const p = new PipeSeg({ diameters: [1] })
		const d = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const s = new Splitter({ source: p, destinations: [d] })

		expect(p.destination).toBe(s)
	})

	it('should set length of the source pipe', () => {
		const p = new PipeSeg({ diameters: [1] })
		const d = new PipeSeg({ diameters: [1], start: { x: 3, y: 4 } })
		const s = new Splitter({ source: p, destinations: [d] })

		expect(p.length).toBe(5)
	})

	it('should accept destinations (1)', () => {
		const p = new PipeSeg({ diameters: [1] })
		const d = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const s = new Splitter({ source: p, destinations: [d] })

		expect(s.destinations[0]).toBe(d)
	})

	it('should accept destinations (2)', () => {
		const p = new PipeSeg({ diameters: [1] })
		const d = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const e = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const s = new Splitter({ source: p, destinations: [d, e] })

		expect(s.destinations[1]).toBe(e)
	})

	it('should throw error if destinations start from different places', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 7, y: 9 } })

		expect(() => new Splitter({ source: p, destinations: [q, r] })).toThrow(
			/New destination starts from different coordinates/
		)
	})

	it('should receive x position from destination', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })

		expect(s.properties.start.x).toBe(4)
	})

	it('should receive y position from destination', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })

		expect(s.properties.start.y).toBe(5)
	})
})

describe('setDestFlowrate', () => {
	it('should reject an index that is too high', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })

		expect(() => s.setDestFlowrate(3, 12)).toThrow(/No destination at index/)
	})

	it('should reject an index that is too low', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })

		expect(() => s.setDestFlowrate(-1, 12)).toThrow(/No destination at index/)
	})

	it('should set the flowrate of the selected destination', () => {
		const p = new PipeSeg({ diameters: [1], start: { x: 1, y: 1 } })
		const q = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [1], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })
		s.setDestFlowrate(1, 12)

		expect(r.properties.flowrate).toBe(12)
	})
})

describe('setDestPressure', () => {
	it('should set the pressure of the destination (1)', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const q = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })
		s.setDestPressure()

		expect(q.properties.start.pressure).toBe(p.endPressure())
	})

	it('should set the pressure of the destination (2)', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const q = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q, r] })
		s.setDestPressure()

		expect(r.properties.start.pressure).toBe(p.endPressure())
	})

	it('should be called when a destination is added', () => {
		const p = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const q = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const r = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const s = new Splitter({ source: p, destinations: [q] })

		s.setDestPressure = jest.fn()
		s.addDestination(r)

		expect(s.setDestPressure).toHaveBeenCalled()
	})
})

describe('guessFlowRate', () => {
	it('should set the flowrate for the pipe segments in the branch (0)', () => {
		const sourcePipe = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const branch2p2 = new PipeSeg({
			diameters: [0.9144],
			start: { x: 4, y: 5 },
		})
		branch2.setDestination(branch2p2)

		const s = new Splitter({
			source: sourcePipe,
			destinations: [branch1, branch2],
		})

		s.guessFlowRate(0, 10)

		expect(branch1.properties.flowrate).toBe(10)
	})

	it('should set the flowrate for the pipe segments in the branch (1)', () => {
		const sourcePipe = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const branch2p2 = new PipeSeg({
			diameters: [0.9144],
			start: { x: 4, y: 5 },
		})
		branch2.setDestination(branch2p2)

		const s = new Splitter({
			source: sourcePipe,
			destinations: [branch1, branch2],
		})

		s.guessFlowRate(1, 10)

		expect(branch2.properties.flowrate).toBe(10)
	})

	it('should set the flowrate for the pipe segments in the branch (2)', () => {
		const sourcePipe = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const branch2p2 = new PipeSeg({
			diameters: [0.9144],
			start: { x: 4, y: 5 },
		})
		branch2.setDestination(branch2p2)

		const s = new Splitter({
			source: sourcePipe,
			destinations: [branch1, branch2],
		})

		s.guessFlowRate(1, 10)

		expect(branch2p2.properties.flowrate).toBe(10)
	})

	it('should return the pressure at the end of the branch', () => {
		const sourcePipe = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const branch2p2 = new PipeSeg({
			diameters: [0.9144],
			start: { x: 4, y: 5 },
		})
		branch2.setDestination(branch2p2)

		const s = new Splitter({
			source: sourcePipe,
			destinations: [branch1, branch2],
		})

		const branchEndPressure = s.guessFlowRate(1, 100)

		expect(branchEndPressure).toBe(299864.60702306876)
	})

	it('should return a value that matches the end pressure of the last pipe segment (with a destination) in the branch', () => {
		const sourcePipe = new PipeSeg({
			diameters: [0.9144],
			start: { x: 1, y: 1, pressure: 300000, temperature: 350 },
			flowrate: 100,
		})
		const branch1 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })

		const branch2 = new PipeSeg({ diameters: [0.9144], start: { x: 4, y: 5 } })
		const branch2p2 = new PipeSeg({
			diameters: [0.9144],
			start: { x: 4, y: 5 },
		})
		branch2.setDestination(branch2p2)

		const s = new Splitter({
			source: sourcePipe,
			destinations: [branch1, branch2],
		})

		const branchEndPressure = s.guessFlowRate(1, 100)

		expect(branchEndPressure).toBe(branch2.endPressure())
	})
})
