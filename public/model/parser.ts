import fs from 'fs'
import YAML from 'yaml'
import { IPhysicalElement } from './element'
import { IPipeDefinition } from './pipeSeg'
import SnapshotBuilder, {
	AddInlet,
	AddSplitter,
	AddWell,
	AddReservoir,
	AddPipeSeg,
	AddPipeSeries,
} from './snapshotBuilder'
import PipeSeg from './pipeSeg'

const OLGA = {
	parse: (fileString: string) => {
		const lines = fileString.split('\n')
		const linesReversed = lines.slice().reverse()

		const lineThatStartsWith = (
			word: string,
			backwards = false
		): [number, string] => {
			const searchArr = backwards ? linesReversed : lines
			const idx = searchArr.findIndex((line) =>
				line.startsWith(word.toUpperCase())
			)
			if (idx < 0) {
				throw new Error(`Line not found: ${word}`)
			}
			if (backwards) {
				return [lines.length - idx - 1, linesReversed[idx]]
			}
			return [idx, lines[idx]]
		}
		const lastLineThatStartsWith = (word: string): [number, string] => {
			return lineThatStartsWith(word, true)
		}

		const keyLines = {
			initialConditions: lineThatStartsWith('initialconditions'),
			geometry: lineThatStartsWith('geometry'),
			firstPipe: lineThatStartsWith('pipe'),
			lastPipe: lastLineThatStartsWith('pipe'),
		}

		const readLineProperties = (line: string | [number, string]) => {
			if (typeof line !== 'string') {
				line = line[1]
			}
			line = line.replace(/NSEGMENT=\d+,\s/g, '')
			line = line.replace(/LSEGMENT=.+\).+?,\s/g, '')

			const [type, parameterStrings] = [
				line.substring(0, line.indexOf(' ')),
				line.substring(line.indexOf(' ')).trim().split(', '),
			]

			if (type == 'GEOMETRY') {
				console.log(type, parameterStrings)
			}

			const unitConversion = (valueString: string) => {
				try {
					const matchNum = valueString.match(/-?[0-9]+\.?[0-9]*/)

					if (!matchNum) {
						const matchName = valueString.match(/".+?"/)
						if (matchName) {
							return [matchName[0], '-']
						} else return [null, null]
					}
					const numVal = matchNum[0]

					let num = Number(numVal)
					let unitString = valueString.substring(numVal.length).trim()

					switch (unitString) {
						case 'km':
							num = num * 1000
							unitString = 'm'
							break
						case 'mm':
							num = num / 1000
							unitString = 'm'
							break
					}

					return [Number(num.toFixed(4)), unitString]
				} catch {
					return [null, null]
				}
			}

			const parameters = parameterStrings.reduce(
				(acc, param) => {
					const [property, valueString] = param
						.split('=')
						.map((s) => s.trim()) as [string, string]
					if (type === 'GEOMETRY') {
						console.log({ property, valueString })
					}
					acc[property] = unitConversion(valueString)
					return acc
				},
				type === 'GEOMETRY' ? { YSTART: [0, 'm'] } : {}
			)
			return { type, parameters }
		}

		const INLET = readLineProperties(keyLines.geometry)
		console.log(INLET)

		let prevX = 0
		const getXLength = (lineParams) => {
			if (!lineParams.XEND) return 0
			const length = lineParams.XEND[0] - prevX
			prevX = lineParams.XEND[0]
			return length
		}

		let endElevation = INLET.parameters.YSTART as [number, string]

		const getElevation = (lineParams) => {
			const elevation = endElevation
			if (lineParams.YEND) {
				endElevation = lineParams.YEND
			}
			return elevation[0]
		}

		const transformProperties = (lineProps) => {
			const params = lineProps.parameters

			const instructionMap = {
				GEOMETRY: 'inlet',
				PIPE: 'pipeseg',
			}

			type PipeSegInstruction = {
				name: string
				length: number
				elevation: number
				diameters: number[]
			}

			type PipeSeriesInstruction = {
				n: number
				pipeDef: IPipeDefinition
				elevations: number[]
				lengths: number[]
			}

			const instructionType: string = instructionMap[lineProps.type]

			const transformed = {
				[instructionType]: {
					name: params.LABEL[0],
					length: getXLength(params),
					elevation: getElevation(params),
					diameters: params.DIAMETER ? [params.DIAMETER[0]] : undefined,
				} as PipeSegInstruction | PipeSeriesInstruction,
			}

			for (const key of Object.keys(transformed[instructionType])) {
				if (!transformed[instructionType][key]) {
					delete transformed[instructionType][key]
				}
			}

			const maxSegLength = 200
			const reduceToMaxLengthArr = (length: number) => {
				if (length < maxSegLength) return [length]

				const lengths: number[] = []

				const sum = () => lengths.reduce((acc, a) => acc + a, 0)
				const remainder = () => length - sum()

				while (remainder() >= maxSegLength) {
					lengths.push(maxSegLength)
				}
				if (remainder()) {
					lengths.push(remainder())
				} else return [maxSegLength]
				return lengths
			}

			if (
				instructionType === 'pipeseg' &&
				(transformed.pipeseg as PipeSegInstruction).length &&
				(transformed.pipeseg as PipeSegInstruction).length > maxSegLength
			) {
				const fullLength = (transformed.pipeseg as PipeSegInstruction).length
				const seriesLengths = reduceToMaxLengthArr(fullLength)

				// Elevation
				let lengthSoFar = 0
				const startElevation = (transformed.pipeseg as PipeSegInstruction)
					.elevation
				const elevationIncrease = endElevation[0] - startElevation
				const elevations = seriesLengths.map((sLength) => {
					lengthSoFar += sLength
					const yGain = (elevationIncrease * lengthSoFar) / fullLength
					return Number((startElevation + yGain).toFixed(4))
				})
				elevations.unshift(startElevation)
				elevations.pop()

				transformed.pipeseries = <PipeSeriesInstruction>{
					n: seriesLengths.length,
					pipeDef: {
						name: (transformed.pipeseg as PipeSegInstruction).name,
						length: fullLength,
						elevation: startElevation,
						diameters: [
							...(transformed.pipeseg as PipeSegInstruction).diameters,
						],
					},
					elevations,
					lengths: seriesLengths,
				}

				delete transformed.pipeseg
			}

			return transformed
		}

		const pipes = lines
			.slice(keyLines.firstPipe[0], keyLines.lastPipe[0] + 1)
			.map(readLineProperties)

		const data = {
			instructions: [
				transformProperties(INLET),
				...pipes.map(transformProperties),
			],
		}

		return data
	},
}

export default class Parser {
	data: any
	constructor() {}

	readFile(fileName: string, save = false) {
		const file = fs.readFileSync(fileName, 'utf-8')
		if (!file) {
			throw new Error(`No file: ${fileName}`)
		}
		const fileExtension = fileName.substring(fileName.indexOf('.') + 1)
		switch (fileExtension) {
			case 'yml':
			case 'yaml':
				this.data = YAML.parse(file)
				break
			case 'genkey':
				this.data = OLGA.parse(file)
				break
			default:
				throw new Error(`File type not supported: ${fileExtension}`)
		}

		if (save) {
			fs.writeFileSync(
				`${fileName.substring(0, fileName.indexOf('.'))}.yml`,
				YAML.stringify(this.data)
			)
		}

		return this.data
	}

	build() {
		if (!this.data) {
			throw new Error(
				`No data - call this.readFile(fileName) before this.build()`
			)
		}
		const builder = new SnapshotBuilder()

		for (const instruction of this.data.instructions) {
			for (let [type, parameters] of Object.entries(instruction)) {
				type = type.toLowerCase()

				if (type in ['selectsplitter', 'branch', 'setfluid']) {
					switch (type) {
						case 'selectsplitter':
							const { id } = parameters as { id: number | string }
							builder.selectSplitter(id)
							break
						case 'branch':
							const adder = builder.branch()
							const pipeDef = parameters as IPipeDefinition
							;(adder as AddPipeSeg)(pipeDef)
							break
						case 'setfluid':
							const { pressure, temperature, flowrate } = parameters as {
								pressure: number
								temperature: number
								flowrate: number
							}
							builder.setFluid(pressure, temperature, flowrate)
							break
					}
					continue
				}

				const adder = builder.chainAdd(type)

				switch (type) {
					case 'inlet':
						{
							const { name, physical } = parameters as {
								name: string
								physical: IPhysicalElement
							}
							;(adder as AddInlet)(name, physical)
						}
						break
					case 'pipeseg':
						{
							const pipeDef = parameters as IPipeDefinition
							;(adder as AddPipeSeg)(pipeDef)
						}
						break
					case 'splitter':
						{
							const { name, physical } = parameters as {
								name: string
								physical: IPhysicalElement
							}
							;(adder as AddSplitter)(name, physical)
						}
						break
					case 'well':
						{
							const { name, physical, source, realReservoirName } =
								parameters as {
									name: string
									physical: IPhysicalElement
									source: PipeSeg
									realReservoirName: 'Hamilton' | 'Hamilton North' | 'Lennox'
								}
							;(adder as AddWell)(name, physical, source, realReservoirName)
						}
						break
					case 'reservoir':
						{
							const { name, physical, pressure } = parameters as {
								name: string
								physical: IPhysicalElement
								pressure: number
							}
							;(adder as AddReservoir)(name, physical, pressure)
						}
						break
					case 'pipeseries':
						{
							const { n, pipeDef, elevations, lengths } = parameters as {
								n: number
								pipeDef: IPipeDefinition
								elevations: number[]
								lengths: number[]
							}

							;(adder as AddPipeSeries)(n, pipeDef, elevations, lengths)
						}
						break
					default:
						throw new Error(`${type} not supported`)
				}
			}
		}

		return builder.elements[0]
	}
}
