import Fluid from './fluid'
import { defaultFluidConstructor } from './fluid'
import { IPhysicalElement, PressureSolution } from './element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities'
import Analogue from './analogue'
import Reservoir, { RealReservoir } from './reservoir'
import Well from './well'

const perforationFunctions = {}

perforationFunctions[RealReservoir.Hamilton] = {
	intercept: -0.723155611559477,
	powers: [
		[1, 0],
		[0, 1],
		[2, 0],
		[1, 1],
		[0, 2],
		[3, 0],
		[2, 1],
		[1, 2],
		[0, 3],
		[4, 0],
		[3, 1],
		[2, 2],
		[1, 3],
		[0, 4],
	],
	coefficients: [
		-7.45839244e-2, 8.00571236e-1, 1.0322175e-2, -1.25228384e-2, 1.22712427e-2,
		-2.27136569e-4, 9.60433607e-5, 1.48900866e-4, -1.79135752e-4, 1.70799719e-7,
		2.11473864e-6, -2.05817226e-6, -1.19052163e-7, 7.62239511e-7,
	],
}

perforationFunctions[RealReservoir.HamiltonNorth] = {
	intercept: -1.4034521453141124,
	powers: [
		[1, 0],
		[0, 1],
		[2, 0],
		[1, 1],
		[0, 2],
		[3, 0],
		[2, 1],
		[1, 2],
		[0, 3],
		[4, 0],
		[3, 1],
		[2, 2],
		[1, 3],
		[0, 4],
	],
	coefficients: [
		-2.97089238e-1, 1.03991433, 2.16958803e-2, -1.91488122e-3, -2.63657614e-4,
		-4.00000553e-4, -2.3425952e-4, 1.4304453e-4, -1.41347907e-5, 1.67823295e-6,
		2.12423698e-6, 7.26210847e-7, -9.550614e-7, 1.27674948e-7,
	],
}

perforationFunctions[RealReservoir.Lennox] = {
	intercept: -0.5326763044220115,
	powers: [
		[1, 0],
		[0, 1],
		[2, 0],
		[1, 1],
		[0, 2],
		[3, 0],
		[2, 1],
		[1, 2],
		[0, 3],
		[4, 0],
		[3, 1],
		[2, 2],
		[1, 3],
		[0, 4],
	],
	coefficients: [
		-5.20839196e-2, 1.02365102, 1.62250266e-3, 1.94289091e-4, -6.32437645e-4,
		-1.73358992e-5, -4.41477875e-6, -1.72118067e-6, 7.74807823e-6,
		2.59089315e-8, 1.01987079e-7, -6.13300111e-8, 3.41781956e-8, -3.36623543e-8,
	],
}

export default class Perforation extends Analogue {
	source?: Well
	destination: Reservoir | null

	constructor(
		name: string,
		physical: IPhysicalElement,
		realReservoir: RealReservoir
	) {
		super(name, physical, 'Well', perforationFunctions[realReservoir])
		this.destination = null
	}

	setDestination(dest: Reservoir) {
		this.destination = dest
		dest.source = this
	}
}
