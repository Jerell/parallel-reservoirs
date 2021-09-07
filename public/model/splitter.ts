import PipeSeg from './pipeSeg';
import Fluid, { defaultFluidConstructor } from './fluid';
import IElement, { IPhysicalElement, PressureSolution } from './element';
import Transport from './transport';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';

const fs = require('fs');

// const stream = fs.createWriteStream(`${__dirname}/splitQ.txt`, {
// 	flags: 'a',
// });
const stream2 = fs.createWriteStream(`${__dirname}/out.txt`, {
	flags: 'a',
});

export default class Splitter extends Transport {
	source: PipeSeg;
	destinations: IElement[] = [];
	fluid?: Fluid;

	constructor(name: string, physical: IPhysicalElement, source: PipeSeg) {
		super(name, physical, 'Splitter');
		this.source = source;

		this.source.setDestination(this);
	}

	addDestination(dest: IElement) {
		if (dest.physical.elevation !== this.physical.elevation)
			throw new Error(
				'Destination elevation does not match splitter elevation'
			);
		this.destinations.push(dest);
		dest.source = this;
	}

	setDestinations(destinations: IElement[]) {
		destinations.forEach((d) => this.addDestination(d));
	}

	async applyFlowrate(
		branch: number,
		flowrate: Flowrate,
		guesses: number,
		logFn: (guessNum: number, q: Flowrate) => void
	): Promise<PressureSolution> {
		if (!this.fluid) {
			throw new Error(
				'Splitter has no fluid - unable to calculate end pressure'
			);
		}

		// stream.write(
		// 	`${this.type} - ${this.name} BRANCH ${branch} GUESS ${guesses}:\n${this.fluid.pressure} Pa\n${flowrate} kg/s\n\n`
		// )

		logFn(guesses, flowrate);

		const newFluid = await defaultFluidConstructor(
			this.fluid.pressure,
			this.fluid.temperature,
			flowrate
		);

		return this.destinations[branch].process(newFluid);
	}

	async searchBranchFlowrate(branch: number, fluid: Fluid, logFn) {
		if (!fluid) {
			throw new Error(
				'Splitter has no fluid - unable to calculate end pressure'
			);
		}
		let low = 0;
		let high = fluid.flowrate.kgps;
		let mid = 0;

		let guesses = 0;
		const maxGuesses = 30;

		let pressureSolution = PressureSolution.Low;

		while (pressureSolution !== PressureSolution.Ok) {
			if (guesses++ > maxGuesses - 1) {
				console.log(`max guesses (${maxGuesses}) reached`);
				break;
			}

			mid = (low + high) / 2;

			if (mid >= fluid.flowrate.kgps * 0.9) {
				return { flowrate: mid, pressureSolution };
			}

			if (mid <= new Flowrate(0.001, FlowrateUnits.Kgps).kgps) {
				return { flowrate: mid, pressureSolution: PressureSolution.Low };
			}

			// console.log({ branch, guesses, flowrate: mid })

			pressureSolution = await this.applyFlowrate(
				branch,
				new Flowrate(mid, FlowrateUnits.Kgps),
				guesses,
				() => logFn(guesses, mid)
			);
			if (pressureSolution === PressureSolution.Low) {
				high = mid;
			} else if (pressureSolution === PressureSolution.High) {
				low = mid;
			}
		}

		return { flowrate: mid, pressureSolution };
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		this.fluid = fluid;

		const lowPressureLimit = new Pressure(1000, PressureUnits.Pascal).pascal;
		if (this.fluid.pressure.pascal < lowPressureLimit)
			return PressureSolution.Low;

		const newFluid = await defaultFluidConstructor(
			this.fluid.pressure,
			this.fluid.temperature,
			this.fluid.flowrate
		);

		const Qs: Flowrate[] = [];

		const writeOutput = (branch: number) => (guessNum: number, q: Flowrate) => {
			Qs[branch] = q;

			stream2.write(
				`${guessNum}) DG pressure: ${fluid.pressure.bara} Bara | HM flowrate: ${Qs[0]} kg/s | HN flowrate: ${Qs[1]} kg/s | LX flowrate: ${Qs[2]} kg/s\n`
			);
		};

		for (let i = 0; i < this.destinations.length - 1; i++) {
			const { flowrate, pressureSolution } = await this.searchBranchFlowrate(
				i,
				newFluid,
				writeOutput(i)
			);

			if (pressureSolution !== PressureSolution.Ok) {
				return pressureSolution;
			}
			newFluid.flowrate = new Flowrate(
				newFluid.flowrate.kgps - flowrate,
				FlowrateUnits.Kgps
			);
		}

		const lastSearchResult = await this.applyFlowrate(
			this.destinations.length - 1,
			newFluid.flowrate,
			0,
			writeOutput(2)
		);
		return lastSearchResult;
	}
}
