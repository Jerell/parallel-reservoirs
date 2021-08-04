import PipeSeg from './pipeSeg'
import Fluid from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'

export default class Splitter implements IElement {
	source: PipeSeg
	destinations: IElement[] = []
	fluid?: Fluid
	physical: IPhysicalElement
	type: string = 'Splitter'
	name: string

	constructor(source: PipeSeg, physical: IPhysicalElement, name: string) {
		this.source = source
		this.physical = physical
		this.name = name

		this.source.setDestination(this)
	}

	addDestination(dest: IElement) {
		if (dest.physical.elevation !== this.physical.elevation)
			throw new Error('Destination elevation does not match splitter elevation')
		this.destinations.push(dest)
		dest.source = this
	}

	setDestinations(destinations: IElement[]) {
		destinations.forEach((d) => this.addDestination(d))
	}

	applyFlowrate(branch: number, flowrate: number): PressureSolution {
		if (!this.fluid) {
			throw new Error(
				'Splitter has no fluid - unable to calculate end pressure'
			)
		}

		const newFluid = new Fluid(
			this.fluid.pressure,
			this.fluid?.temperature,
			flowrate
		)

		return this.destinations[branch].process(newFluid)
	}

	searchBranchFlowrate(branch: number, fluid: Fluid) {
		if (!fluid)
			throw new Error(
				'Splitter has no fluid - unable to calculate end pressure'
			)
		let low = 0
		let high = fluid.flowrate
		let mid = 0

		const stepSize = 0.001
		let guesses = 0
		const maxGuesses = 25

		let pressureSolution = PressureSolution.Low

		// while (low <= high) {
		while (pressureSolution !== PressureSolution.Ok) {
			if (guesses++ > maxGuesses) {
				console.log(`max guesses (${maxGuesses}) reached`)
				break
			}

			mid = (low + high) / 2

			pressureSolution = this.applyFlowrate(branch, mid)
			if (pressureSolution === PressureSolution.Low) {
				high = mid - stepSize
			} else if (pressureSolution === PressureSolution.High) {
				low = mid + stepSize
			}
		}

		return { flowrate: mid, pressureSolution }
	}

	process(fluid: Fluid): PressureSolution {
		this.fluid = fluid
		// throw new Error('Not implemented')

		const newFluid = new Fluid(
			this.fluid.pressure,
			this.fluid.temperature,
			this.fluid.flowrate
		)

		for (let i = 0; i < this.destinations.length - 1; i++) {
			const { flowrate, pressureSolution } = this.searchBranchFlowrate(
				i,
				newFluid
			)
			if (pressureSolution !== PressureSolution.Ok) {
				return pressureSolution
			}
			newFluid.flowrate -= flowrate
		}

		return this.searchBranchFlowrate(this.destinations.length - 1, newFluid)
			.pressureSolution
	}
}
