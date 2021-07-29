interface IReservoir {
	volume: number
}

export default class Reservoir {
	inflow: number
	amount: number
	volume: number
	temperature: number

	constructor(props: IReservoir) {
		this.inflow = 0
		this.amount = 0
		this.volume = props.volume
		this.temperature = 10
	}

	getPressure() {
		const n = this.amount * 1
		const R = 8.31446261815324
		const T = this.temperature
		const V = this.volume

		return (n * R * T) / V
	}
}
