import Transport from './transport'
import Fluid, { defaultFluidConstructor } from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

export interface IPipeDefinition extends IPhysicalElement {
	length: number
	diameters: number[]
	elevation: number
	name: string
}

export default class PipeSeg extends Transport {
	fluid?: Fluid
	physical: IPipeDefinition
	_source: IElement | null
	destination: IElement | null

	constructor(pipeDef: IPipeDefinition) {
		super(pipeDef.name, pipeDef, 'PipeSeg')

		this.physical = pipeDef

		this._source = null
		this.destination = null
	}

	get source() {
		return this._source as IElement
	}

	set source(node: IElement) {
		this._source = node
	}

	get effectiveArea() {
		return this.physical.diameters
			.map((d) => (Math.PI / 4) * d ** 2)
			.reduce((acc, a) => (acc += a), 0)
	}

	removeLine(size) {
		if (!this.physical.diameters.includes(size)) {
			throw new Error(`Pipe does not have a line of size ${size}`)
		}
		if (this.physical.diameters.length === 1) {
			throw new Error(`Pipe only has one line`)
		}
		this.physical.diameters.splice(this.physical.diameters.indexOf(size), 1)
	}

	addLine(size) {
		this.physical.diameters.push(size)
	}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	get height() {
		if (!this.destination) throw new Error('No destination')
		return this.destination.physical.elevation - this.physical.elevation
	}

	endPressure() {
		if (!this.fluid)
			throw new Error(
				'Pipe segment has no fluid - unable to calculate end pressure'
			)
		const w = this.fluid.flowrate
		const D = Math.sqrt(this.effectiveArea / Math.PI) * 2
		const A = this.effectiveArea
		const ρ = this.fluid.density
		const v = 1 / ρ
		const L = this.physical.length
		const P1 = this.fluid.pressure

		// Friction factor
		const u = w / (A * ρ)
		const μ = this.fluid.viscosity
		const Re = (ρ * u * D) / μ
		const ε = 4.5e-5
		const f = 0.25 / (Math.log10(ε / (3.7 * D) + 5.74 / (Re ^ 0.7)) ^ 2)

		const domainLimitingTerm = Math.sqrt((A ** 2 * D * P1) / (f * L * v))
		if (domainLimitingTerm <= w) {
			return 0
		}

		const g = 9.807
		const elevationLoss = g * this.height * ρ

		return (
			(A * Math.sqrt(D)) ** -1 *
				Math.sqrt(P1) *
				Math.sqrt(A ** 2 * D * P1 - f * L * v * w ** 2) -
			elevationLoss
		)
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid

		// TODO: remove this after adding reservoirs to tests
		if (!this.destination) return PressureSolution.Ok

		const p = this.endPressure()

		const endFluid = await defaultFluidConstructor(
			new Pressure(p, PressureUnits.Pascal),
			new Temperature(fluid.temperature, TemperatureUnits.Kelvin),
			fluid.flowrate
		)

		return await this.destination.process(endFluid)
	}
}
