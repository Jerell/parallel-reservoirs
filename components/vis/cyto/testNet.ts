import PipeSeg from '@/public/model/pipeSeg'
import Splitter from '@/public/model/splitter'

const branchPipesFrom = (
	start: PipeSeg | Splitter,
	length: number,
	xInterval = 100
) => {
	const b = [start]
	for (let i = 0; i < length; i++) {
		if (b[i] instanceof PipeSeg) {
			const n = new PipeSeg({
				diameters: (b[i] as PipeSeg).diameters,
				start: {
					x: b[i].properties.start.x + xInterval,
					y: b[i].properties.start.y,
				},
			})
			b.push(n)
			;(b[i] as PipeSeg).setDestination(n)
		}
		if (b[i] instanceof Splitter) {
			const n = new PipeSeg({
				diameters: [0.9144],
				start: {
					x: (b[i] as Splitter).destinations[0].properties.start.x,
					y: (b[i] as Splitter).destinations[0].properties.start.y,
				},
			})
			b.push(n)
			;(b[i] as Splitter).addDestination(n)
		}
	}
	return start
}

export default function testNet() {
	const yLevels = [50, 100, 150, 200]
	const xInterval = 110
	const getX = (pos) => pos * xInterval + 140

	// Branch 1
	const branch1 = new PipeSeg({
		diameters: [0.9144],
		start: { x: getX(0), y: yLevels[1] },
	})
	const branch1p2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: getX(1), y: yLevels[0] },
	})
	branch1.setDestination(branch1p2)
	branchPipesFrom(branch1p2, 3)

	// Branch 2
	const branch2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: getX(0), y: yLevels[1] },
	})
	const branch2p2 = new PipeSeg({
		diameters: [0.9144],
		start: { x: getX(1), y: yLevels[2] },
	})
	branch2.setDestination(branch2p2)
	const branch2p3 = new PipeSeg({
		diameters: [0.9144],
		start: { x: getX(2), y: yLevels[2] },
	})
	branch2p2.setDestination(branch2p3)

	// Source to splitter
	const sourcePipe = new PipeSeg({
		diameters: [0.9144],
		start: { x: 50, y: yLevels[1], pressure: 300000, temperature: 350 },
		flowrate: 100,
	})
	const s = new Splitter({
		source: sourcePipe,
		destinations: [branch1, branch2],
	})

	branchPipesFrom(s, 6)

	return branch2p2
}
