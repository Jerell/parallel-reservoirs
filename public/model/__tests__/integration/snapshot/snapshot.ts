import Parser from '../../../parser'
import Fluid from '../../../fluid'
import Inlet from '../../../inlet'
import Splitter from '../../../splitter'
import Well from '../../../well'
import Perforation from '../../../perforation'
import Reservoir from '../../../reservoir'
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities'

describe('Test case', () => {
	test('from trello', async () => {
		const parser = new Parser()
		parser.readFile(`${__dirname}/../../inputFiles/hynet/whole.yml`)
		await parser.build()
		const keyPoints = parser.keyPoints

		const inlet = keyPoints[0] as Inlet
		const highPLim = new Pressure(35, PressureUnits.Bara)

		await inlet.applyInletProperties(
			highPLim.pascal,
			300,
			new Flowrate(4.5, FlowrateUnits.MTPA).kgps,
			true
		)

		const result = await inlet.searchInletPressure()

		expect(inlet).toBeInstanceOf(Inlet)
	})
})
