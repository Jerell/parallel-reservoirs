import SnapshotBuilder from '../../../snapshotBuilder'
import Inlet from '../../../inlet'
import PipeSeg from '../../../pipeSeg'
import Well from '../../../well'
import Perforation from '../../../perforation'
import Reservoir from '../../../reservoir'
import Splitter from '../../../splitter'

describe('add', () => {
	it('should create an inlet', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 })

		expect(builder.elements[0]).toBeInstanceOf(Inlet)
	})

	it('should create a pipeseg', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).add('PipeSeg')({
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		expect(builder.elements[1]).toBeInstanceOf(PipeSeg)
	})

	it('should create a series of pipesegs', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).chainAdd('pipeseries')(3, {
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		expect(builder.elements[1]).toBeInstanceOf(PipeSeg)
		expect(builder.elements[2]).toBeInstanceOf(PipeSeg)
		expect(builder.elements[3]).toBeInstanceOf(PipeSeg)
		expect(builder.elements.length).toBe(4)
	})

	it('should create a series of pipesegs with different elevations', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).chainAdd('pipeseries')(
			10,
			{
				name: 'p',
				elevation: 1,
				length: 200,
				diameters: [1, 2, 3, 4],
			},
			[2, 3]
		)

		expect(builder.elements[7].physical.elevation).toBe(3)
		expect(builder.elements.length).toBe(11)
	})

	it('should create a series of pipesegs with different lengths', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).chainAdd('pipeseries')(
			10,
			{
				name: 'p',
				elevation: 1,
				length: 200,
				diameters: [1, 2, 3, 4],
			},
			[0],
			[2, 3]
		)

		expect((builder.elements[7] as PipeSeg).physical.length).toBe(3)
		expect(builder.elements.length).toBe(11)
	})

	it('should create a well', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).add('PipeSeg')({
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		const pipeseg = builder.previousElem

		builder.add('well')('HM-All', { elevation: 0 }, pipeseg, 'Hamilton')

		expect(builder.elements[2]).toBeInstanceOf(Well)
		expect(builder.previousElem).toBeInstanceOf(Perforation)
		expect(builder.elements.length).toBe(4)
	})

	it('should create a splitter', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).add('PipeSeg')({
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		const pipeseg = builder.previousElem

		builder.add('splitter')('split1', { elevation: 0 }, pipeseg)

		expect(builder.elements[2]).toBeInstanceOf(Splitter)
	})

	it('should create a reservoir', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).add('PipeSeg')({
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		const pipeseg = builder.previousElem

		builder
			.add('well')('HM-All', { elevation: 0 }, pipeseg, 'Hamilton')
			.add('reservoir')('Hamilton', { elevation: 0 }, 4)

		expect(builder.previousElem).toBeInstanceOf(Reservoir)
		expect(builder.previousElem.source.name).toBe('HM-All')
	})
})

describe('chain', () => {
	it('should connect a pipe to an inlet', async () => {
		const builder = new SnapshotBuilder()

		builder.add('Inlet')('start', { elevation: 0 }).chainAdd('PipeSeg')({
			name: 'p',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})

		expect(builder.elements.length).toBe(2)
		expect(builder.previousElem).toBeInstanceOf(PipeSeg)
		expect(builder.previousElem.source).toBeInstanceOf(Inlet)
		expect(builder.previousElem.source.name).toBe('start')
	})
})

describe('navigation - selectSplitter', () => {
	const builder = new SnapshotBuilder()
	builder
		.add('Inlet')('start', { elevation: 0 })
		.chainAdd('PipeSeg')({
			name: 'inletpipe',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})
		.chainAdd('splitter')('split1', { elevation: 0 }, builder.previousElem)
		.chainAdd('pipeseg')({
			name: 's1-s2',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})
		.chainAdd('splitter')('split2', { elevation: 0 }, builder.previousElem)

	test('setup', () => {
		expect(builder.previousElem).toBeInstanceOf(Splitter)
		expect(builder.splitters.length).toBe(2)
		expect(builder.selectSplitter(0)).toBeInstanceOf(SnapshotBuilder)
	})

	test('select by name', () => {
		builder.selectSplitter('split1')
		expect(builder.selectedSplitter.name).toBe('split1')
		builder.selectSplitter('split2')
		expect(builder.selectedSplitter.name).toBe('split2')
	})

	test('select by position', () => {
		builder.selectSplitter(0)
		expect(builder.selectedSplitter.name).toBe('split1')
		builder.selectSplitter(1)
		expect(builder.selectedSplitter.name).toBe('split2')
	})

	test('branch', () => {
		builder.selectSplitter(0)
		builder.branch('pipeseg')({
			name: 'froms1',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})
		expect(builder.previousElem.source.name).toBe('split1')

		builder.selectSplitter('split2')
		builder.branch('pipeseg')({
			name: 'froms2',
			elevation: 0,
			length: 200,
			diameters: [1, 2, 3, 4],
		})
		expect(builder.previousElem.source.name).toBe('split2')
	})
})
