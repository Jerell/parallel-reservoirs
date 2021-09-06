import Transport from './transport';
import Fluid, { defaultFluidConstructor } from './fluid';
import IElement, { IPhysicalElement, PressureSolution } from './element';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

const fs = require('fs');

const stream = fs.createWriteStream(`${__dirname}/evaluated.txt`, {
	flags: 'a',
});
const stream2 = fs.createWriteStream(`${__dirname}/lengthP.txt`, {
	flags: 'a',
});

export interface IPipeDefinition extends IPhysicalElement {
	length: number;
	diameters: number[];
	elevation: number;
	name: string;
}

export default class PipeSeg extends Transport {
	fluid?: Fluid;
	physical: IPipeDefinition;
	_source: IElement | null;
	destination: IElement | null;

	constructor(pipeDef: IPipeDefinition) {
		super(pipeDef.name, pipeDef, 'PipeSeg');

		this.physical = pipeDef;

		this._source = null;
		this.destination = null;
	}

	get source() {
		return this._source as IElement;
	}

	set source(node: IElement) {
		this._source = node;
	}

	get effectiveArea() {
		return this.physical.diameters
			.map((d) => (Math.PI / 4) * d ** 2)
			.reduce((acc, a) => (acc += a), 0);
	}

	removeLine(size) {
		if (!this.physical.diameters.includes(size)) {
			throw new Error(`Pipe does not have a line of size ${size}`);
		}
		if (this.physical.diameters.length === 1) {
			throw new Error(`Pipe only has one line`);
		}
		this.physical.diameters.splice(this.physical.diameters.indexOf(size), 1);
	}

	addLine(size) {
		this.physical.diameters.push(size);
	}

	setDestination(dest: IElement) {
		this.destination = dest;
		dest.source = this;
	}

	get height() {
		if (!this.destination) throw new Error('No destination');
		return this.destination.physical.elevation - this.physical.elevation;
	}

	endPressure(): Pressure {
		if (!this.fluid)
			throw new Error(
				'Pipe segment has no fluid - unable to calculate end pressure'
			);
		const w = this.fluid.flowrate;
		const D = Math.sqrt(this.effectiveArea / Math.PI) * 2;
		const A = this.effectiveArea;
		const ρ = this.fluid.density;
		const v = 1 / ρ;
		const L = this.physical.length;
		const P1 = this.fluid.pressure;

		// Friction factor
		const u = w.kgps / (A * ρ);
		const μ = this.fluid.viscosity;
		const Re = (ρ * u * D) / μ;
		const ε = 4.5e-5;
		const f =
			0.25 / Math.log10((ε * 1000) / (3.7 * D * 1000) + 5.74 / Re ** 0.9) ** 2;

		const g = 9.807;
		const elevationLoss = g * this.height * ρ;

		let endP =
			(A * Math.sqrt(D)) ** -1 *
				Math.sqrt(P1.pascal) *
				Math.sqrt(A ** 2 * D * P1.pascal - f * L * v * w.kgps ** 2) -
			elevationLoss;

		endP = isNaN(endP) ? 0 : endP;

		const limit = new Pressure(13500000, PressureUnits.Pascal);
		const capped = Math.max(Math.min(endP, limit.pascal), 0);

		return new Pressure(capped, PressureUnits.Pascal);
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid;

		// TODO: remove this after adding reservoirs to tests
		if (!this.destination) return PressureSolution.Ok;

		const p = this.endPressure();
		const lowPressureLimit = new Pressure(1000, PressureUnits.Pascal).pascal;

		stream.write(
			`${this.physical.name}, ${p.bara} Bara, ${this.fluid.flowrate.kgps} kg/s\n`
		);
		stream2.write(`${this.physical.length}, ${p}\n`);

		if (p.pascal < lowPressureLimit) return PressureSolution.Low;

		const endFluid = await defaultFluidConstructor(
			p,
			fluid.temperature,
			fluid.flowrate
		);

		return await this.destination.process(endFluid);
	}
}
