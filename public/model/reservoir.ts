import IElement, { IPhysicalElement, PressureSolution } from './element';
import Fluid from './fluid';
import Perforation from './perforation';

export enum RealReservoir {
	Hamilton,
	HamiltonNorth,
	Lennox,
}

const fs = require('fs');

const stream = fs.createWriteStream(`${__dirname}/resP.txt`, {
	flags: 'a',
});

export default class Reservoir implements IElement {
	type: string = 'Reservoir';
	name: string;
	physical: IPhysicalElement;
	pressure: number;
	fluid?: Fluid;
	source?: Perforation;

	constructor(name: string, physical: IPhysicalElement, pressure: number) {
		this.name = name;
		this.physical = physical;
		this.pressure = pressure;
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		if (!fluid) {
			throw new Error(`No fluid received`);
		}
		this.fluid = fluid;

		stream.write(
			`${this.name}: ${this.fluid.pressure} Pa | ${this.fluid.flowrate} kg/s\n`
		);

		const upper = this.pressure * 1.01;
		const lower = this.pressure * 0.99;

		return await (() => {
			if (fluid.pressure < lower) {
				return PressureSolution.Low;
			}
			if (fluid.pressure > upper) {
				return PressureSolution.High;
			}
			return PressureSolution.Ok;
		})();
	}
}
