import IPhaseEnvelopeFileReader from './phaseEnvelopeFileReader'
import { Pressure, Temperature } from 'physical-quantities'
import IFluidPropertiesFileReader from './fluidDataFileReader'
import boundarySearch from '../utils/boundarySearch'

type xyNumberPoints = { x0y0: number; x0y1: number; x1y0: number; x1y1: number }
type ptWeights = {
	TM: {
		lowPT: {
			up: number
			down: number
		}
		highPT: {
			up: number
			down: number
		}
	}
	PT: {
		up: number
		down: number
	}
}

function ptWeightedAverage(points: xyNumberPoints, weights: ptWeights) {
	const x0avg =
		weights.TM.lowPT.down * points.x0y0 + weights.TM.lowPT.up * points.x0y1
	const x1avg =
		weights.TM.highPT.down * points.x1y0 + weights.TM.highPT.up * points.x1y1

	const avg = weights.PT.down * x0avg + weights.PT.up * x1avg

	return avg
	return
}
export default class FluidProperties {
	phaseData: Promise<PhaseData>
	fluidData: Promise<FluidData>
	fluidPressures: number[] = []

	constructor(
		phaseData: IPhaseEnvelopeFileReader,
		fluidData: IFluidPropertiesFileReader
	) {
		this.phaseData = phaseData.readPhaseEnvelope()
		this.fluidData = fluidData.readFluidProperties()
	}

	async phase(pressure: Pressure, temperature: Temperature) {
		const data = await this.phaseData
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

	async searchNearbyPoints(pressure: Pressure, temperature: Temperature) {
		const fluidData = await this.fluidData

		const pressureSearchResult = boundarySearch(
			fluidData.uniquePressures,
			pressure.pascal
		)

		const rows = {
			highPressure:
				fluidData.groupedByPressure[pressureSearchResult.result.high],
			lowPressure: fluidData.groupedByPressure[pressureSearchResult.result.low],
		}

		const listTemperatures = (list: FluidDatum[]) => list.map((row) => row[1])

		const temps = {
			highPressure: listTemperatures(rows.highPressure),
			lowPressure: listTemperatures(rows.lowPressure),
		}

		const tempSearchResult = {
			highPT: boundarySearch(temps.highPressure, temperature.celsius),
			lowPT: boundarySearch(temps.lowPressure, temperature.celsius),
		}

		const points = {
			x0y0: rows.lowPressure[tempSearchResult.lowPT.idx.low],
			x0y1: rows.lowPressure[tempSearchResult.lowPT.idx.high],
			x1y0: rows.highPressure[tempSearchResult.lowPT.idx.low],
			x1y1: rows.highPressure[tempSearchResult.lowPT.idx.high],
		}

		const weights: ptWeights = {
			TM: {
				lowPT: {
					up: tempSearchResult.lowPT.weights.high || 0.5,
					down: tempSearchResult.lowPT.weights.low || 0.5,
				},
				highPT: {
					up: tempSearchResult.highPT.weights.high || 0.5,
					down: tempSearchResult.highPT.weights.low || 0.5,
				},
			},
			PT: {
				up: pressureSearchResult.weights.high || 0.5,
				down: pressureSearchResult.weights.low || 0.5,
			},
		}

		return {
			points,
			weights,
		}
	}

	async viscosity(pressure: Pressure, temperature: Temperature) {
		const phase = await this.phase(pressure, temperature)

		if (phase === 2) {
			throw new Error('Fluid is two-phase')
		}

		let viscIdx

		if (phase === Phase.Gas) viscIdx = 3
		if (phase === Phase.Liquid) viscIdx = 4

		const { points: pointsAroundSearchValues, weights } =
			await this.searchNearbyPoints(pressure, temperature)

		const selectViscosity = (point: FluidDatum) => point[viscIdx]

		const viscosities = Object.keys(pointsAroundSearchValues).reduce(
			(acc, key) => {
				acc[key] = selectViscosity(pointsAroundSearchValues[key])
				return acc
			},
			{} as xyNumberPoints
		)

		const avg = ptWeightedAverage(viscosities, weights)

		return avg
	}

	async enthalpy(pressure: Pressure, temperature: Temperature) {
		const { points: pointsAroundSearchValues, weights } =
			await this.searchNearbyPoints(pressure, temperature)

		const selectViscosity = (point: FluidDatum) => point[2]

		const viscosities = Object.keys(pointsAroundSearchValues).reduce(
			(acc, key) => {
				acc[key] = selectViscosity(pointsAroundSearchValues[key])
				return acc
			},
			{} as xyNumberPoints
		)

		const avg = ptWeightedAverage(viscosities, weights)

		return avg
	}
}

export type FluidDatum = [
	PT: number,
	TM: number,
	HG: number,
	VISG: number,
	VISHL: number
]

export class FluidData {
	data: FluidDatum[]
	uniquePressures: number[] = []
	groupedByPressure: { [PT: number]: FluidDatum[] } = {}

	constructor(data: FluidDatum[]) {
		this.data = data
		data.forEach((datum) => {
			if (!this.groupedByPressure[datum[0]]) {
				this.groupedByPressure[datum[0]] = []
			}
			this.groupedByPressure[datum[0]].push(datum)

			if (!this.uniquePressures.includes(Number(datum[0]))) {
				this.uniquePressures.push(Number(datum[0]))
			}
		})
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
