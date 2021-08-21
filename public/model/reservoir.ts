import IElement, { IPhysicalElement, PressureSolution } from './element'
import Fluid from './fluid'
import Perforation from './perforation'

export enum RealReservoir {
	Hamilton,
	HamiltonNorth,
	Lennox,
}

export default class Reservoir implements IElement {
	type: string = 'Reservoir'
	name: string
	physical: IPhysicalElement
	pressure: number
	fluid?: Fluid
	source?: Perforation

	constructor(name: string, physical: IPhysicalElement, pressure: number) {
		this.name = name
		this.physical = physical
		this.pressure = pressure
	}

	process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid
		throw new Error('Not implemented')
	}
}
