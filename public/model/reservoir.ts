import IElement, { IPhysicalElement, PressureSolution } from './element'
import Fluid from './fluid'

export default class Reservoir implements IElement {
	type: string = 'Reservoir'
	name: string
	physical: IPhysicalElement
	pressure: number

	constructor(physical: IPhysicalElement, name: string, pressure: number) {
		this.name = name
		this.physical = physical
		this.pressure = pressure
	}

	process(fluid: Fluid): PressureSolution {
		throw new Error('Not implemented')
	}
}
