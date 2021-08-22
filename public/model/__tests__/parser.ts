import Parser from '../parser'
import Inlet from '../inlet'
import PipeSeg from '../pipeSeg'
import Splitter from '../splitter'

describe('readFile', () => {
	it('should read the input file', () => {
		const parser = new Parser()
		const data = parser.readFile(`${__dirname}/inputFiles/inletAndPipeSeg.yml`)

		const expected = {
			instructions: [
				{ inlet: { name: 'start', physical: { elevation: 0 } } },
				{
					pipeseg: {
						name: 'pipe1',
						diameters: [1, 2, 3, 4],
						elevation: 0,
						length: 200,
					},
				},
			],
		}

		expect(data).toEqual(expected)
	})
})

describe('build', () => {
	it('should create a simple network', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/inletAndPipeSeg.yml`)
		const root = parser.build()

		expect(root).toBeInstanceOf(Inlet)
		expect((root as Inlet).destination).toBeInstanceOf(PipeSeg)
	})

	it('should create a more complex network (twosplit)', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/twosplit.yml`)
		const root = parser.build()

		expect(root).toBeInstanceOf(Inlet)
		expect((root as Inlet).destination).toBeInstanceOf(PipeSeg)
		expect(((root as Inlet).destination as PipeSeg).destination).toBeInstanceOf(
			Splitter
		)
		expect(
			(((root as Inlet).destination as PipeSeg).destination as Splitter)
				.destinations[0]
		).toBeInstanceOf(PipeSeg)
		expect(
			(
				(((root as Inlet).destination as PipeSeg).destination as Splitter)
					.destinations[0] as PipeSeg
			).destination
		).toBeInstanceOf(Splitter)
	})
})
