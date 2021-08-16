import Fluid from './fluid'
import IElement, { PressureSolution } from './element'
import Transport from './transport'
import defaultFluidConstructor from './fluid'

export default class Inlet extends Transport {
	fluid: Fluid | null
	destination: IElement | null

	constructor(name, physical) {
		super(name, physical, 'Inlet')

		this.fluid = null
		this.destination = null
	}

	async setInletProperties(pressure, flowrate) {}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	async process(fluid: Fluid) {
		if (!this.destination) return PressureSolution.Ok

		return await this.destination.process(fluid)
	}
}
