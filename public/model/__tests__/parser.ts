import Parser from '../parser'
import Inlet from '../inlet'
import PipeSeg from '../pipeSeg'
import Splitter from '../splitter'

describe('readFile', () => {
	it('should read a .yml input file', () => {
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

	it('should read a .genkey file', () => {
		const parser = new Parser()
		const data = parser.readFile(`${__dirname}/inputFiles/001-DTTC2.genkey`)

		const expected = {
			instructions: [
				{ inlet: { name: '01_ST_CoQ', elevation: 14.51 } },
				{
					pipeseg: {
						name: 'PIPE-001',
						length: 470,
						elevation: 14.51,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-002',
						length: 860,
						elevation: 25.25,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-003',
						length: 1120,
						elevation: 13.04,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-004',
						length: 1560,
						elevation: 7.99,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-005',
						length: 1310,
						elevation: 6.51,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-006',
						length: 870,
						elevation: 2.51,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-007',
						length: 1190,
						elevation: 13.67,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-008',
						length: 740,
						elevation: 25.04,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-009',
						length: 970,
						elevation: 11.99,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-010',
						length: 1040,
						elevation: 22.73,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-011',
						length: 560,
						elevation: 10.93,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-012',
						length: 1740,
						elevation: 30.52,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-013',
						length: 1560,
						elevation: 31.78,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-014',
						length: 790,
						elevation: 28.2,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-015',
						length: 320,
						elevation: 15.78,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-016',
						length: 2500,
						elevation: 5.25,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-017',
						length: 2460,
						elevation: 5.04,
						diameters: [0.8759],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-018',
						length: 1980,
						elevation: 5.67,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-019',
						length: 1210,
						elevation: 11.78,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-020',
						length: 940,
						elevation: 46.73,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-021',
						length: 1830,
						elevation: 80.64,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-022',
						length: 1390,
						elevation: 88.22,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-023',
						length: 1040,
						elevation: 89.9,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-024',
						length: 920,
						elevation: 90.96,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-025',
						length: 940,
						elevation: 109.91,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-026',
						length: 420,
						elevation: 100.85,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-027',
						length: 450,
						elevation: 89.69,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-028',
						length: 810,
						elevation: 101.49,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-029',
						length: 10,
						elevation: 89.06,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-030',
						length: -10,
						elevation: 88.43,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-031',
						length: 30,
						elevation: 87.77,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-032',
						length: 10,
						elevation: 87.17,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-033',
						length: 60,
						elevation: 86.88,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-034',
						length: 420,
						elevation: 86.53,
						diameters: [0.8886],
					},
				},
				{
					pipeseg: {
						name: 'PIPE-035',
						length: 500,
						elevation: 67.58,
						diameters: [0.8886],
					},
				},
			],
		}

		expect(data).toEqual(expected)
	})
})

describe('build from .yml', () => {
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

	it('should create a more complex network (series)', () => {
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

describe('build from .genkey', () => {
	it('should create a pipeseries when the length would be too long for one pipeseg', () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/inputFiles/pipeTooLong.genkey`)
		const root = parser.build()

		const pipe1 = (root as Inlet).destination as PipeSeg
		const pipe2 = (pipe1 as PipeSeg).destination as PipeSeg
		const pipe3 = (pipe2 as PipeSeg).destination as PipeSeg
		const pipe4 = (pipe3 as PipeSeg).destination as PipeSeg

		expect(pipe1.physical.length).toBe(200)
		expect(pipe2.physical.length).toBe(200)
		expect(pipe3.physical.length).toBe(70)
		expect(pipe4.physical.length).toBe(200)
	})
})
