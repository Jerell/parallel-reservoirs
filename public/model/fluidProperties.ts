import IPhaseEnvelopeFileReader from './phaseEnvelopeFileReader'
import { Pressure, Temperature } from './units'

export default class FluidProperties {
	data: Promise<PhaseData>

	constructor(phaseData: IPhaseEnvelopeFileReader) {
		this.data = phaseData.readPhaseEnvelope()
	}

	async phase(pressure: Pressure, temperature: Temperature) {
		const data = await this.data
		if (!data.data.length) {
			throw new Error('No data')
		}
		const rightIdx = data.data.findIndex(
			(point) => point[0] > temperature.celsius
		)
		if (rightIdx === 0) {
			throw new Error('Out of range')
		}
		const leftIdx = rightIdx - 1
		const [left, right] = [data.data[leftIdx], data.data[rightIdx]]

		const xInterval = right[0] - left[0]
		const distFromLeft = temperature.celsius - left[0]
		const fractionBetween = distFromLeft / xInterval

		const interpolatePoints = (
			leftPoint: PhaseDatum,
			rightPoint: PhaseDatum,
			n: number
		): number => {
			const yInterval = rightPoint[n] - leftPoint[n]
			const gain = fractionBetween * yInterval
			return leftPoint[n] + gain
		}

		const [bubblePressure, dewPressure] = [1, 2].map((i) =>
			interpolatePoints(left, right, i)
		)

		const aboveBubble = pressure.pascal > bubblePressure
		const aboveDew = pressure.pascal > dewPressure

		if (aboveBubble) {
			return Phase.Liquid
		}
		if (aboveDew) {
			return Phase.TwoPhase
		}
		return Phase.Gas
	}
}

export type PhaseDatum = [temp: number, bubble: number, dew: number]

export class PhaseData {
	// Assume Celsius and Pascal for this constructor
	//TODO: assume kelvin when data provided
	data: PhaseDatum[]

	constructor(data: PhaseDatum[]) {
		this.data = data
	}
}

export enum Phase {
	Gas,
	Liquid,
	TwoPhase,
}
