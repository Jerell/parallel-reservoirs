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

export default class Parser {
	data: any
	constructor() {}

	readFile(fileName: string) {
		const file = fs.readFileSync(fileName, 'utf-8')
		if (!file) {
			throw new Error(`No file: ${fileName}`)
		}
		this.data = YAML.parse(file)

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
