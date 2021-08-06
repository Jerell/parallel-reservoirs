import IPhaseEnvelopeFileReader from './phaseEnvelopeFileReader'
import { Pressure, Temperature } from 'physical-quantities'
import IFluidPropertiesFileReader from './fluidDataFileReader'
import boundarySearch from '../utils/boundarySearch'

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

	async viscosity(pressure: Pressure, temperature: Temperature) {
		const phase = await this.phase(pressure, temperature)
		const fluidData = await this.fluidData

		if (phase === 2) {
			throw new Error('Fluid is two-phase')
		}

		let viscIdx

		if (phase === Phase.Gas) viscIdx = 3
		if (phase === Phase.Liquid) viscIdx = 4

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

		const pointsAroundSearchValues = {
			x0y0: rows.lowPressure[tempSearchResult.lowPT.idx.low],
			x0y1: rows.lowPressure[tempSearchResult.lowPT.idx.high],
			x1y0: rows.highPressure[tempSearchResult.lowPT.idx.low],
			x1y1: rows.highPressure[tempSearchResult.lowPT.idx.high],
		}

		const selectViscosity = (point: FluidDatum) => point[viscIdx]

		const viscosities = Object.keys(pointsAroundSearchValues).reduce(
			(acc, key) => {
				acc[key] = selectViscosity(pointsAroundSearchValues[key])
				return acc
			},
			{} as { x0y0: number; x0y1: number; x1y0: number; x1y1: number }
		)

		const weights = {
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

		const x0avg =
			weights.TM.lowPT.down * viscosities.x0y0 +
			weights.TM.lowPT.up * viscosities.x0y1
		const x1avg =
			weights.TM.highPT.down * viscosities.x1y0 +
			weights.TM.highPT.up * viscosities.x1y1

		const avg = weights.PT.down * x0avg + weights.PT.up * x1avg

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
