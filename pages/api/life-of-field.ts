import type { NextApiRequest, NextApiResponse } from 'next';
import protect from '@/public/utils/api/protect';
import fetch from 'node-fetch';
import {
	Pressure,
	PressureUnits,
	Temperature,
	TemperatureUnits,
	Flowrate,
	FlowrateUnits,
} from 'physical-quantities';
import { POINT_CONVERSION_COMPRESSED } from 'constants';

function validateLOFRequest(
	body: {
		inlet: {
			temperature: number;
			flowrate: number;
		};
		reservoirPressures: {
			HM: number;
			HN: number;
			LX: number;
		};
		timestep: number;
		steps: number;
	},
	res: NextApiResponse
) {
	if (
		!body.inlet ||
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
	} else if (!body.timestep) {
		res.status(400).json({ response: 'missing timestep' });
	} else if (!body.steps) {
		res.status(400).json({ response: 'missing steps' });
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
	validateLOFRequest(body, res);
	if (res.statusCode === 400) return;

	const setupSnapshot = (
		inletT: string | number,
		inletQ: string | number,
		hmP: string | number,
		hnP: string | number,
		lxP: string | number
	) => {
		return {
			inlet: {
				temperature: Number(inletT),
				flowrate: Number(inletQ),
			},
			reservoirPressures: {
				HM: Number(hmP),
				HN: Number(hnP),
				LX: Number(lxP),
			},
		};
	};

	const initialSetup = setupSnapshot(
		body.inlet.temperature,
		body.inlet.flowrate,
		body.reservoirPressures.HM,
		body.reservoirPressures.HN,
		body.reservoirPressures.LX
	);

	// Specify the units the snapshot API returns and receives
	const snapUnit = {
		p: (n) => new Pressure(n, PressureUnits.Pascal).bara,
		t: (n) => new Temperature(n, TemperatureUnits.Kelvin).celsius,
		q: (n) => new Flowrate(n, FlowrateUnits.Kgps).kgps,
	};

	const extractSnapshotData = (json) => {
		json = json.keyPoints;

		const reservoirProperties = (key) => {
			return {
				pressure: snapUnit.p(json[key].pressure._pascal),
				flowrate: snapUnit.q(json[key].flowrate._kgps),
			};
		};

		const HM = reservoirProperties('Hamilton');
		const HN = reservoirProperties('Hamilton North');
		const LX = reservoirProperties('Lennox');

		if (json.POA) {
			const inlet = {
				temperature: snapUnit.t(json.POA.temperature._kelvin),
				flowrate: snapUnit.q(json.POA.flowrate._kgps),
			};
			return { inlet, HM, HN, LX };
		}
		return { HM, HN, LX };
	};

	const setupConditions = [initialSetup];
	const snapshots: {}[] = [];

	const extractTimestepData = (json) => {
		const data = Object.assign({}, extractSnapshotData(snapshots[0]));
		const reservoirs = ['HM', 'HN', 'LX'];

		reservoirs.forEach((reservoir) => {
			data[reservoir].pressure = snapUnit.p(json[reservoir]._pascal);
		});

		return data;
	};

	for (let i = 0; i <= body.steps; i++) {
		const snapshotRequest = await fetch(`${process.env.NEXTAPI_URL}/snapshot`, {
			method: 'POST',
			body: JSON.stringify(setupConditions[i]),
			headers: req.headers,
		});

		const snapshot = await snapshotRequest.json();
		snapshots.push(snapshot);

		const keyData = extractSnapshotData(snapshot);
		const reservoirsOnly = {
			HM: keyData.HM,
			HN: keyData.HN,
			LX: keyData.LX,
		};

		const timestepRequest = await fetch(
			`${process.env.NEXTAPI_URL}/life-of-field/reservoirFlowrateTimestep`,
			{
				method: 'POST',
				body: JSON.stringify({ ...reservoirsOnly, days: body.timestep }),
				headers: req.headers,
			}
		);

		const timestepResult = await timestepRequest.json();

		const afterTimestep = extractTimestepData(timestepResult);

		setupConditions.push(
			setupSnapshot(
				afterTimestep.inlet!.temperature,
				afterTimestep.inlet!.flowrate,
				afterTimestep.HM.pressure,
				afterTimestep.HN.pressure,
				afterTimestep.LX.pressure
			)
		);
	}

	res.status(200).json({ snapshots });
};
