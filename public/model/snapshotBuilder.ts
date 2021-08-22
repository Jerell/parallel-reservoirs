import IElement, { IPhysicalElement } from './element'
import Inlet from './inlet'
import PipeSeg, { IPipeDefinition } from './pipeSeg'
import Splitter from './splitter'
import Reservoir, { RealReservoir } from './reservoir'
import Well from './well'
import Perforation from './perforation'
import Fluid, { defaultFluidConstructor } from './fluid'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'

export type AddInlet = (
	name: string,
	physical: IPhysicalElement
) => SnapshotBuilder

export type AddSplitter = (
	name: string,
	physical: IPhysicalElement,
	source: PipeSeg
) => SnapshotBuilder

export type AddWell = (
	name: string,
	physical: IPhysicalElement,
	source: PipeSeg,
	realReservoirName: string
) => SnapshotBuilder

export type AddReservoir = (
	name: string,
	physical: IPhysicalElement,
	pressure: number
) => SnapshotBuilder

export type AddPipeSeg = (pipeDef: IPipeDefinition) => SnapshotBuilder

export type AddPipeSeries = (
	n: number,
	pipeDef: IPipeDefinition,
	elevations?: number[],
	lengths?: number[]
) => SnapshotBuilder

export default class SnapshotBuilder {
	elements: IElement[] = []
	splitters: Splitter[] = []
	selectedSplitter?: Splitter
	previousElem?: IElement
	fluid?: Fluid
	constructor() {}

	add(type: string, source?: Inlet | PipeSeg | Splitter) {
		const set = (elem) => {
			if (!this.elements.length) {
				if (!(elem instanceof Inlet)) {
					throw new Error(`First element must be inlet`)
				}
			}
			this.previousElem = elem
			this.elements.push(elem)
			if (elem instanceof Splitter) {
				this.splitters.push(elem)
				this.selectedSplitter = elem
			}
		}
		switch (type.toLowerCase()) {
			case 'inlet':
				return (name: string, physical: IPhysicalElement) => {
					const elem = new Inlet(name, physical)

					set(elem)
					return this
				}
			case 'splitter':
				return (name: string, physical: IPhysicalElement, source: PipeSeg) => {
					const elem = new Splitter(name, physical, source)

					set(elem)
					return this
				}
			case 'well':
				return (
					name: string,
					physical: IPhysicalElement,
					source: PipeSeg,
					realReservoirName: string
				) => {
					if (!Object.values(RealReservoir).includes(realReservoirName)) {
						throw new Error(`Unsupported reservoir: ${realReservoirName}`)
					}
					const well = new Well(
						name,
						physical,
						RealReservoir[realReservoirName]
					)
					well.source = source

					set(well)

					const perforation = new Perforation(
						name,
						physical,
						RealReservoir[realReservoirName]
					)

					well.setDestination(perforation)

					set(perforation)
					return this
				}
			case 'reservoir':
				return (name: string, physical: IPhysicalElement, pressure: number) => {
					if (!(this.previousElem instanceof Perforation)) {
						throw new Error(
							`Reservoir creation must come after well (perforation)`
						)
					}
					const reservoir = new Reservoir(name, physical, pressure)
					this.previousElem.setDestination(reservoir)

					set(reservoir)
					return this
				}
			case 'pipeseg':
				return (pipeDef: IPipeDefinition) => {
					const elem = new PipeSeg({ ...pipeDef })

					if (source) {
						if (source instanceof Splitter) {
							source.addDestination(elem)
						} else {
							source.setDestination(elem)
						}
					}

					set(elem)
					return this
				}
			case 'pipeseries':
				return (
					n: number,
					pipeDef: IPipeDefinition,
					elevations: number[] = [],
					lengths: number[] = []
				) => {
					;(this.add('pipeseg', source) as AddPipeSeg)(pipeDef)
					for (let i = 0; i < n - 1; i++) {
						if (elevations.length) {
							pipeDef.elevation = elevations[i % elevations.length]
						}
						if (lengths.length) {
							pipeDef.length = lengths[i % lengths.length]
						}
						;(this.chainAdd('pipeseg') as AddPipeSeg)(pipeDef)
					}
					return this
				}
			default:
				throw new Error(`${type} not supported`)
		}
	}

	chainAdd(type: string, from?: Splitter | PipeSeg) {
		if (!this.previousElem) {
			return this.add(type)
		}
		if (
			this.previousElem instanceof Inlet ||
			this.previousElem instanceof PipeSeg ||
			this.previousElem instanceof Splitter
		) {
			if (from) {
				return this.add(type, from)
			}
			return this.add(type, this.previousElem)
		} else {
			throw new Error(`Previous elem cannot have a destination`)
		}
	}

	async setFluid(pressure: number, temperature: number, flowrate: number) {
		this.fluid = await defaultFluidConstructor(
			new Pressure(pressure, PressureUnits.Pascal),
			new Temperature(temperature, TemperatureUnits.Kelvin),
			flowrate
		)
	}

	selectSplitter(id?: number | string): this {
		if (typeof id === 'string') {
			this.selectedSplitter = this.splitters.find(
				(s) => s.name.toLowerCase() === id.toLowerCase()
			)
		}
		if (typeof id === 'number') {
			if (id < 0 || id >= this.splitters.length) {
				throw new Error(
					`Out of range: splitters exist at positions 0-${this.splitters.length}`
				)
			}
			this.selectedSplitter = this.splitters[id]
		}
		return this
	}

	branch(type: string) {
		if (!this.selectedSplitter) {
			throw new Error(`No splitter selected to branch from`)
		}
		return this.chainAdd(type, this.selectedSplitter)
	}
}
