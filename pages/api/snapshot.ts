import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { Parser, Inlet, Reservoir } from 'ccs-sim';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';
import protect from '@/public/utils/api/protect';

function validateSnapshotRequest(
	body: {
		inlet: {
			pressure: number;
			temperature: number;
			flowrate: number;
		};
		reservoirPressures: {
			HM: number;
			HN: number;
			LX: number;
		};
	},
	res: NextApiResponse
) {
	if (
		!body.inlet ||
		// !body.inlet.pressure ||
		!body.inlet.temperature ||
		!body.inlet.flowrate ||
		!body.reservoirPressures ||
		!body.reservoirPressures.HM ||
		!body.reservoirPressures.HN ||
		!body.reservoirPressures.LX
	) {
		res
			.status(400)
			.json({ response: 'invalid definition of initial conditions' });
	}

	return;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await protect(req, res);
	if (res.statusCode === 401) return;

	if (req.method !== 'POST') {
		res.status(400).send({ message: 'Only POST requests allowed' });
		return;
	}

	const body = JSON.parse(req.body);
	validateSnapshotRequest(body, res);
	if (res.statusCode === 400) return;

	const dir = path.resolve('./public');

	const parser = new Parser();
	parser.readFile(path.join(dir, 'whole.yml'));
	await parser.build();
	const keyPoints = parser.keyPoints;

	const inlet = keyPoints[0] as Inlet;
	const HM = keyPoints[4] as Reservoir;
	const HN = keyPoints[7] as Reservoir;
	const LX = keyPoints[10] as Reservoir;

	const bara = (nounit) => new Pressure(nounit, PressureUnits.Bara);

	HM.pressure = bara(body.reservoirPressures.HM);
	HN.pressure = bara(body.reservoirPressures.HN);
	LX.pressure = bara(body.reservoirPressures.LX);

	await inlet.applyInletProperties(
		new Pressure(10, PressureUnits.Bara), // placeholder
		new Temperature(body.inlet.temperature, TemperatureUnits.Celsius),
		new Flowrate(body.inlet.flowrate, FlowrateUnits.Kgps),
		true
	);

	await inlet.searchInletPressure();

	res.status(200).json({
		keyPoints: keyPoints.reduce((acc, point) => {
			acc[point.name] = point.fluid
				? {
						pressure: point.fluid.pressure,
						temperature: point.fluid.temperature,
						flowrate: point.fluid.flowrate,
				  }
				: {
						pressure: NaN,
						temperature: NaN,
						flowrate: NaN,
				  };
			return acc;
		}, {}),
	});
};
