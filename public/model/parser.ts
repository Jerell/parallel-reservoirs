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
			if (line.includes('NSEGMENT')) {
				line = line.substring(0, line.indexOf('NSEGMENT'))
			}
			if (line.includes('LSEGMENT')) {
				line = line.substring(0, line.indexOf('LSEGMENT'))
			}
			const [type, parameterStrings] = [
				line.substring(0, line.indexOf(' ')),
				line.substring(line.indexOf(' ')).trim().split(', '),
			]

			const unitConversion = (valueString: string) => {
				try {
					const matchNum = valueString.match(/[0-9]*\.?[0-9]*/)
					if (!matchNum) {
						return [null, null]
					}
					const numVal = matchNum[0]

					if (!numVal) {
						if (valueString.includes('"')) {
							const textContentMatch = valueString.match(/[\w\d]+-*[\w\d]*/)
							if (!textContentMatch) {
								return [valueString, '-']
							}
							const textContent = textContentMatch[0]
							return [textContent, '-']
						}
						return [valueString, '-']
					}

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

					return [num, unitString]
				} catch {
					return [null, null]
				}
			}

			const parameters = parameterStrings.map((param) => {
				const [property, valueString] = param.split('=').map((s) => s.trim())

				return { [property]: unitConversion(valueString) }
			})
			return { type, parameterStrings, parameters }
		}

		console.log(readLineProperties(keyLines.firstPipe).parameters)

		return 0
	},
}

export default class Parser {
	data: any
	constructor() {}

	readFile(fileName: string) {
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
				throw new Error(`File type not suppoeted: ${fileExtension}`)
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
