import Splitter from './splitter'

interface IPipeSeg {
	diameters: number[]
	flowrate?: number
	start?: {
		x?: number
		y?: number
		pressure?: number
		temperature?: number
	}
}

export default class PipeSeg {
	diameters: number[]
	properties: {
		flowrate: number
		start: {
			x: number
			y: number
			pressure: number
			temperature: number
		}
	}
	_source: PipeSeg | Splitter | null
	destination: PipeSeg | Splitter | null

	constructor(props: IPipeSeg) {
		this.diameters = props.diameters

		this.properties = {
			flowrate: props.flowrate || 0,
			start: {
				pressure: (props.start && props.start.pressure) || 2e6,
				temperature: (props.start && props.start.temperature) || 10,
				x: (props.start && props.start.x) || 0,
				y: (props.start && props.start.y) || 0,
			},
		}
		this._source = null
		this.destination = null
	}

	get source() {
		return this._source as PipeSeg | Splitter
	}

	set source(n: PipeSeg | Splitter) {
		this.properties.flowrate = n.properties.flowrate
		this._source = n
	}

	get effectiveArea() {
		return this.diameters
			.map((d) => (Math.PI / 4) * d ** 2)
			.reduce((acc, a) => (acc += a), 0)
	}

	removeLine(size) {
		if (!this.diameters.includes(size)) {
			throw new Error(`Pipe does not have a line of size ${size}`)
		}
		if (this.diameters.length === 1) {
			throw new Error(`Pipe only has one line`)
		}
		this.diameters.splice(this.diameters.indexOf(size), 1)
	}

	addLine(size) {
		this.diameters.push(size)
	}

	setDestination(dest: PipeSeg | Splitter) {
		this.destination = dest
		dest.source = this
		this.setDestPressure()
	}

	get length() {
		if (!this.destination) {
			console.log(this.properties.start)
			throw new Error('No destination')
		}
		const xDiff = this.destination.properties.start.x - this.properties.start.x
		const yDiff = this.destination.properties.start.y - this.properties.start.y
		return Math.sqrt(xDiff ** 2 + yDiff ** 2)
	}

	get height() {
		if (!this.destination) throw new Error('No destination')
		return this.destination.properties.start.y - this.properties.start.y
	}

	density(): number {
		// ρ=(Pμ)/(RT)
		const μ = 0.044
		const R = 8.31462
		return Number(
			(this.properties.start.pressure * μ) /
				(R * this.properties.start.temperature)
		)
	}

	viscosity(): number {
		const μ0 = 0.000018 // Ref viscosity
		const T0 = 373 // Ref temperature
		const C = 240 // Southerland constant
		const T = this.properties.start.temperature
		return μ0 * ((T0 + C) / (T + C)) * (T / T0) ** (3 / 2)
	}

	endPressure(length = this.length) {
		const w = this.properties.flowrate
		const D = Math.sqrt(this.effectiveArea / Math.PI) * 2
		const A = this.effectiveArea
		const ρ = this.density()
		const v = 1 / ρ
		const L = length
		const P1 = this.properties.start.pressure

		// Friction factor
		const u = w / (A * ρ)
		const μ = this.viscosity()
		const Re = (ρ * u * D) / μ
		const f = Re < 2000 ? 64 / Re : 0.094 / (D * 1000) ** (1 / 3)

		const domainLimitingTerm = Math.sqrt((A ** 2 * D * P1) / (f * L * v))
		if (domainLimitingTerm <= w) {
			return 0
		}

		return (
			(A * Math.sqrt(D)) ** -1 *
			Math.sqrt(P1) *
			Math.sqrt(A ** 2 * D * P1 - f * L * v * w ** 2)
		)
	}

	setDestPressure() {
		if (!this.destination) throw new Error('No destination')
		const p = this.endPressure()
		this.destination.properties.start.pressure = p
		this.destination.properties.flowrate = this.properties.flowrate
		return p
	}
}
