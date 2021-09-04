import IElement, { IPhysicalElement } from './element';
import Inlet from './inlet';
import PipeSeg, { IPipeDefinition } from './pipeSeg';
import Splitter from './splitter';
import Reservoir, { RealReservoir } from './reservoir';
import Well from './well';
import Perforation from './perforation';
import Fluid, { defaultFluidConstructor } from './fluid';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

export type AddInlet = (
	name: string,
	physical: IPhysicalElement
) => SnapshotBuilder;

export type AddSplitter = (
	name: string,
	physical: IPhysicalElement
) => SnapshotBuilder;

export type AddWell = (
	name: string,
	physical: IPhysicalElement,
	realReservoirName: string
) => SnapshotBuilder;

export type AddReservoir = (
	name: string,
	physical: IPhysicalElement,
	pressure: number
) => SnapshotBuilder;

export type AddPipeSeg = (pipeDef: IPipeDefinition) => SnapshotBuilder;

export type AddPipeSeries = (
	n: number,
	pipeDef: IPipeDefinition,
	elevations?: number[],
	lengths?: number[]
) => SnapshotBuilder;

export default class SnapshotBuilder {
	elements: IElement[] = [];
	keyPoints: IElement[] = [];
	splitters: Splitter[] = [];
	selectedSplitter?: Splitter;
	previousElem?: IElement;
	fluid?: Fluid;
	constructor() {}

	add(type: string, source?: Inlet | PipeSeg | Splitter | Well | Perforation) {
		const set = (elem, isKey = false) => {
			if (!this.elements.length) {
				if (!(elem instanceof Inlet)) {
					throw new Error(`First element must be inlet`);
				}
			}
			this.previousElem = elem;
			this.elements.push(elem);
			if (elem instanceof Splitter) {
				this.splitters.push(elem);
				this.selectedSplitter = elem;
			}
			if (isKey) {
				this.keyPoints.push(elem);
			}
		};
		switch (type.toLowerCase()) {
			case 'inlet':
				return (name: string, physical: IPhysicalElement) => {
					const elem = new Inlet(name, physical);

					set(elem, true);
					return this;
				};
			case 'splitter':
				return (name: string, physical: IPhysicalElement) => {
					if (!(this.previousElem instanceof PipeSeg)) {
						throw new Error(`Splitter creation must come after pipeseg`);
					}
					const elem = new Splitter(name, physical, this.previousElem);

					set(elem, true);
					return this;
				};
			case 'well':
				return (
					name: string,
					physical: IPhysicalElement,
					realReservoirName: string
				) => {
					if (!Object.values(RealReservoir).includes(realReservoirName)) {
						throw new Error(`Unsupported reservoir: ${realReservoirName}`);
					}
					if (!(this.previousElem instanceof PipeSeg)) {
						throw new Error(`Well creation must come after pipe segment `);
					}
					const well = new Well(
						name,
						physical,
						RealReservoir[realReservoirName]
					);
					this.previousElem.setDestination(well);

					set(well, true);

					const perforation = new Perforation(
						name,
						physical,
						RealReservoir[realReservoirName]
					);

					well.setDestination(perforation);

					set(perforation, true);
					return this;
				};
			case 'reservoir':
				return (name: string, physical: IPhysicalElement, pressure: number) => {
					if (!(this.previousElem instanceof Perforation)) {
						throw new Error(
							`Reservoir creation must come after well (perforation)`
						);
					}
					const reservoir = new Reservoir(name, physical, pressure);
					this.previousElem.setDestination(reservoir);

					set(reservoir, true);
					return this;
				};
			case 'pipeseg':
				return (pipeDef: IPipeDefinition) => {
					const elem = new PipeSeg({ ...pipeDef });

					set(elem);

					if (source) {
						if (source instanceof Splitter) {
							source.addDestination(elem);
						} else {
							if (source instanceof Perforation) {
								return this;
							}
							source.setDestination(elem);
						}
					}

					return this;
				};
			case 'pipeseries':
				return (
					n: number,
					pipeDef: IPipeDefinition,
					elevations: number[] = [],
					lengths: number[] = []
				) => {
					for (let i = 0; i < n; i++) {
						if (elevations.length) {
							pipeDef.elevation = elevations[i % elevations.length];
						}
						if (lengths.length) {
							pipeDef.length = lengths[i % lengths.length];
						}
						(this.chainAdd('pipeseg') as AddPipeSeg)(pipeDef);
					}
					return this;
				};
			default:
				throw new Error(`${type} not supported`);
		}
	}

	chainAdd(type: string, from?: Splitter | PipeSeg) {
		if (!this.previousElem || this.previousElem instanceof Reservoir) {
			return this.add(type);
		}
		if (
			this.previousElem instanceof Inlet ||
			this.previousElem instanceof PipeSeg ||
			this.previousElem instanceof Splitter ||
			this.previousElem instanceof Well ||
			this.previousElem instanceof Perforation
		) {
			if (from) {
				return this.add(type, from);
			}
			return this.add(type, this.previousElem);
		} else {
			throw new Error(`Previous elem cannot have a destination`);
		}
	}

	async setFluid(pressure: number, temperature: number, flowrate: number) {
		this.fluid = await defaultFluidConstructor(
			new Pressure(pressure, PressureUnits.Pascal),
			new Temperature(temperature, TemperatureUnits.Kelvin),
			new Flowrate(flowrate, FlowrateUnits.Kgps)
		);
	}

	selectSplitter(id: number | string): this {
		if (typeof id === 'string') {
			this.selectedSplitter = this.splitters.find(
				(s) => s.name.toLowerCase() === id.toLowerCase()
			);
		}
		if (typeof id === 'number') {
			if (id < 0 || id >= this.splitters.length) {
				throw new Error(
					`Out of range: splitters exist at positions 0-${this.splitters.length}`
				);
			}
			this.selectedSplitter = this.splitters[id];
		}
		return this;
	}

	branch() {
		if (!this.selectedSplitter) {
			throw new Error(`No splitter selected to branch from`);
		}
		this.previousElem = this.selectedSplitter;
		return this.chainAdd('pipeseg', this.selectedSplitter);
	}
}
