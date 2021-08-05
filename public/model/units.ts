export class Temperature {
	_kelvin: number

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
