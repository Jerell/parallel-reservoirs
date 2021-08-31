import Fluid from './fluid'
import Transport from './transport'
import { defaultFluidConstructor } from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities'

export type ModelFunction = {
	intercept: number
	powers: Array<number[]>
	coefficients: number[]
}

export default class Analogue extends Transport {
	fluid: Fluid | null
	source?: IElement
	destination: IElement | null
	modelFunction: ModelFunction

	constructor(
		name: string,
		physical: IPhysicalElement,
		type = 'Analogue',
		modelFunction: ModelFunction
	) {
		super(name, physical, type)

		this.fluid = null
		this.destination = null
		this.modelFunction = modelFunction
	}

	get x() {
		if (!this.fluid) {
			throw new Error(`${this.type} has no fluid`)
		}
		// Analogue functions use MTPA
		const q = new Flowrate(this.fluid.flowrate, FlowrateUnits.Kgps)
		return q.kgps
	}

	get y() {
		if (!this.fluid) {
			throw new Error(`${this.type} has no fluid`)
		}
		// Analogue functions use bara
		const p = new Pressure(this.fluid.pressure, PressureUnits.Pascal)
		return p.bara
	}

	endPressure() {
		if (!this.fluid) {
			throw new Error(
				`${this.type} has no fluid - unable to calculate end pressure`
			)
		}

		const [x, y] = [this.x, this.y]

		const subIntoPowers = this.modelFunction.powers.map(
			(powers) => x ** powers[0] * y ** powers[1]
		)
		const multipliedByCoefs = subIntoPowers.map(
			(xy, i) => xy * this.modelFunction.coefficients[i]
		)
		const endP =
			this.modelFunction.intercept +
			multipliedByCoefs.reduce((acc, a) => (acc += a), 0)

		return Math.max(new Pressure(endP, PressureUnits.Bara).pascal, 0)
	}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		if (!this.destination) return PressureSolution.Ok

		this.fluid = fluid

		const p = this.endPressure()

		const endFluid = await defaultFluidConstructor(
			new Pressure(p, PressureUnits.Pascal),
			new Temperature(fluid.temperature, TemperatureUnits.Kelvin),
			new Flowrate(fluid.flowrate, FlowrateUnits.Kgps)
		)

		return await this.destination.process(endFluid)
	}
}
