import Fluid from './fluid'
import Transport from './transport'
import { defaultFluidConstructor } from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
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
		return this.fluid.flowrate
	}

	get y() {
		if (!this.fluid) {
			throw new Error(`${this.type} has no fluid`)
		}
		return this.fluid.pressure
	}

	endPressure() {
		if (!this.fluid) {
			throw new Error(
				`${this.type} has no fluid - unable to calculate end pressure`
			)
		}

		const subIntoPowers = this.modelFunction.powers.map(
			(powers) => this.x ** powers[0] * this.y ** powers[1]
		)
		const multipliedByCoefs = subIntoPowers.map(
			(xy, i) => xy * this.modelFunction.coefficients[i]
		)
		return (
			this.modelFunction.intercept +
			multipliedByCoefs.reduce((acc, a) => (acc += a), 0)
		)
	}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid
		if (!this.destination) return PressureSolution.Ok

		console.log(this.fluid)

		const p = this.endPressure()

		const endFluid = await defaultFluidConstructor(
			new Pressure(p, PressureUnits.Pascal),
			new Temperature(fluid.temperature, TemperatureUnits.Kelvin),
			fluid.flowrate
		)

		return await this.destination.process(endFluid)
	}
}
