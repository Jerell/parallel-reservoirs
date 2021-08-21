import Fluid from './fluid'
import { defaultFluidConstructor } from './fluid'
import { IPhysicalElement, PressureSolution } from './element'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
} from 'physical-quantities'
import Analogue from './analogue'
import { RealReservoir } from './reservoir'
import PipeSeg from './pipeSeg'
import IElement from './element'

const wellFunctions = {}

wellFunctions[RealReservoir.Hamilton] = {
	intercept: -1661.6940108244444,
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
		-3.6376802e1, 1.55541152e2, -5.84074627e-1, 2.68681344, -5.31570166,
		1.24632888e-2, -2.11899545e-3, -4.64762077e-2, 7.64993843e-2, 9.83285397e-4,
		-2.49055361e-3, 2.17305312e-3, -5.59752093e-4, -2.75795248e-4,
	],
}

wellFunctions[RealReservoir.HamiltonNorth] = {
	intercept: 191.75089661332476,
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
		-3.45593409e1, 2.15564527, 2.23465384e-1, 2.24356698, -6.77920973e-1,
		-1.67253619e-1, 2.90239067e-1, -2.2603936e-1, 5.46753646e-2, 4.82575227e-3,
		-8.07577188e-3, 4.18655804e-3, -3.5338429e-5, -2.86732877e-4,
	],
}

wellFunctions[RealReservoir.Lennox] = {
	intercept: -48517.795025533436,
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
		[5, 0],
		[4, 1],
		[3, 2],
		[2, 3],
		[1, 4],
		[0, 5],
		[6, 0],
		[5, 1],
		[4, 2],
		[3, 3],
	],
	coefficients: [
		2.9121663, 1.06009869, 4.9296878e1, 3.64633611e1, 2.11714556e1,
		1.60551838e1, -2.23927047e1, -1.5772629e1, 2.07253437e1, 2.13116395,
		-8.53717457, 1.13332052e1, -5.15446972, 1.72504763e-1, 7.58769945e-2,
		-4.31655329e-1, 9.55705412e-1, -1.0089887, 4.91591861e-1, -8.11675059e-2,
		1.05421816e-3, -7.24384856e-3, 2.06858504e-2, -3.12830672e-2, 2.62002199e-2,
		-1.13630761e-2, 1.94141832e-3,
	],
}

export default class Well extends Analogue {
	source?: PipeSeg
	destination: IElement | null

	constructor(
		name: string,
		physical: IPhysicalElement,
		realWell: RealReservoir
	) {
		super(name, physical, 'Well', wellFunctions[realWell])
		this.destination = null
	}

	get x() {
		if (!this.fluid) {
			throw new Error(`${this.type} has no fluid`)
		}
		return this.fluid.flowrate
	}

	get y() {
		if (!this.fluid) {
			throw new Error(`${this.type} has no fluid`)
		}
		// Well function uses bara
		return new Pressure(this.fluid.pressure, PressureUnits.Pascal).bara
	}

	setDestination(dest: IElement) {
		this.destination = dest
		dest.source = this
	}

	async process(fluid: Fluid): Promise<PressureSolution> {
		if (!this.destination) return PressureSolution.Ok

		this.fluid = fluid

		const p = this.endPressure() // bara

		const endFluid = await defaultFluidConstructor(
			new Pressure(p, PressureUnits.Bara),
			new Temperature(fluid.temperature, TemperatureUnits.Kelvin),
			fluid.flowrate
		)

		return await this.destination.process(endFluid)
	}
}
