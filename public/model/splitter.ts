import PipeSeg from './pipeSeg'
import Fluid, { defaultFluidConstructor } from './fluid'
import IElement, { IPhysicalElement, PressureSolution } from './element'
import Transport from './transport'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

export default class Splitter extends Transport {
	source: PipeSeg
	destinations: IElement[] = []
	fluid?: Fluid

	constructor(source: PipeSeg, physical: IPhysicalElement, name: string) {
		super(name, physical, 'Splitter')
		this.source = source

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

	async applyFlowrate(
		branch: number,
		flowrate: number
	): Promise<PressureSolution> {
		if (!this.fluid) {
			throw new Error(
				'Splitter has no fluid - unable to calculate end pressure'
			)
		}

		const newFluid = await defaultFluidConstructor(
			new Pressure(this.fluid.pressure, PressureUnits.Pascal),
			new Temperature(this.fluid.temperature, TemperatureUnits.Kelvin),
			flowrate
		)

		return this.destinations[branch].process(newFluid)
	}

	async searchBranchFlowrate(branch: number, fluid: Fluid) {
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

			pressureSolution = await this.applyFlowrate(branch, mid)
			if (pressureSolution === PressureSolution.Low) {
				high = mid - stepSize
			} else if (pressureSolution === PressureSolution.High) {
				low = mid + stepSize
			}
		}

		return { flowrate: mid, pressureSolution }
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid

		const newFluid = await defaultFluidConstructor(
			new Pressure(this.fluid.pressure, PressureUnits.Pascal),
			new Temperature(this.fluid.temperature, TemperatureUnits.Kelvin),
			this.fluid.flowrate
		)

		for (let i = 0; i < this.destinations.length - 1; i++) {
			const { flowrate, pressureSolution } = await this.searchBranchFlowrate(
				i,
				newFluid
			)
			if (pressureSolution !== PressureSolution.Ok) {
				return pressureSolution
			}
			newFluid.flowrate -= flowrate
		}

		const lastSearch = await this.searchBranchFlowrate(
			this.destinations.length - 1,
			newFluid
		)
		return lastSearch.pressureSolution
	}
}
