export class Temperature {
	private _kelvin: number

	constructor(t: number, unit: TemperatureUnits) {
		switch (unit) {
			case TemperatureUnits.Celsius:
				this._kelvin = t + 273.15
				break
			case TemperatureUnits.Kelvin:
				this._kelvin = t
				break
			default:
				throw new Error('Unit not supported')
		}
	}

	get celsius() {
		return this.kelvin - 273.15
	}

	get kelvin() {
		return this._kelvin
	}
}

export enum TemperatureUnits {
	Kelvin,
	Celsius,
	Farenheit,
}

export class Pressure {
	private _pascal: number

	constructor(p: number, unit: PressureUnits) {
		switch (unit) {
			case PressureUnits.Pascal:
				this._pascal = p
				break
			case PressureUnits.Bara:
				this._pascal = p * 1e-5
				break
			default:
				throw new Error('Unit not supported')
		}
	}

	get pascal() {
		return this._pascal
	}

	get bara() {
		return this._pascal * 1e5
	}
}

export enum PressureUnits {
	Pascal,
	Bara,
	Barg,
}
