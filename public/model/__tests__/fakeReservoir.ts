import IElement, { IPhysicalElement, PressureSolution } from '../element'
import Fluid from '../fluid'

export default class FakeReservoir implements IElement {
	type: string = 'FakeReservoir'
	name: string
	physical: IPhysicalElement
	pressure: number
	fluid?: Fluid

	constructor(physical: IPhysicalElement, name: string, pressure: number) {
		this.name = name
		this.physical = physical
		this.pressure = pressure
	}

	process(fluid: Fluid) {
		this.fluid = fluid

		const upper = this.pressure * 1.01
		const lower = this.pressure * 0.99

		if (fluid.pressure < lower) {
			return PressureSolution.Low
		}
		if (fluid.pressure > upper) {
			return PressureSolution.High
		}
		return PressureSolution.Ok
	}
}
