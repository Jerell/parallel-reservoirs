import PipeSeg from './pipeSeg'

interface ISplitter {
	source: PipeSeg
	destinations: PipeSeg[]
}

export default class Splitter {
	source: PipeSeg
	destinations: PipeSeg[]
	properties: {
		flowrate: number
		start: {
			x: number
			y: number
			pressure: number
		}
	}

	constructor(props: ISplitter) {
		this.source = props.source
		this.destinations = []

		const x = props.destinations[0].properties.start.x
		const y = props.destinations[0].properties.start.y

		const lengthFromSource = Math.sqrt(
			(x - props.source.properties.start.x) ** 2 +
				(y - props.source.properties.start.y) ** 2
		)

		this.properties = {
			flowrate: props.source.properties.flowrate,
			start: { x, y, pressure: props.source.endPressure(lengthFromSource) },
		}

		props.destinations.forEach((d) => this.addDestination(d))

		this.source.setDestination(this)
	}

	addDestination(dest: PipeSeg) {
		if (this.destinations.length) {
			if (
				dest.properties.start.x !== this.destinations[0].properties.start.x ||
				dest.properties.start.y !== this.destinations[0].properties.start.y
			) {
				throw new Error('New destination starts from different coordinates')
			}
		}
		this.destinations.push(dest)
		dest.source = this
		this.setDestPressure()
	}

	setDestFlowrate(i: number, fr: number) {
		if (i > this.destinations.length) {
			throw new Error(`No destination at index ${i}`)
		}
		if (i < 0) {
			throw new Error(`No destination at index ${i}`)
		}
		this.destinations[i].properties.flowrate = fr
	}

	setDestPressure() {
		this.destinations.forEach(
			(d) => (d.properties.start.pressure = this.properties.start.pressure)
		)
	}

	guessFlowRate(branch: number, flowrate: number) {
		this.setDestFlowrate(branch, flowrate)

		let endBranchPressure: number = 0
		const setEndP = (n: number) => (endBranchPressure = n)

		const retrieveEndPressure = (pipeSeg: PipeSeg) => {
			if (pipeSeg.destination && pipeSeg.destination instanceof PipeSeg) {
				retrieveEndPressure(pipeSeg.destination)
			} else {
				return
			}
			setEndP(pipeSeg.setDestPressure())
		}

		retrieveEndPressure(this.destinations[branch])

		return endBranchPressure
	}
}
